/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-else-return */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { useState, useEffect, useRef} from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Button, Input, TextField } from '@material-ui/core';
import { fgDigitalConfig } from 'src/config';
import { Document, Page, pdfjs } from "react-pdf";
import { isMobile } from "react-device-detect";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

//--------------------------------------------------------------
// Janus Gateway: Variables globales para acceso de renderizado
//--------------------------------------------------------------
var echotest = null;
var janus = null; 
const server = fgDigitalConfig.server_rtc;
var opaqueId = "echotest-" + Janus.randomString(12);
var bitrateTimer = null;

var doSimulcast = (getQueryStringValue("simulcast") === "yes" || getQueryStringValue("simulcast") === "true");
var doSimulcast2 = (getQueryStringValue("simulcast2") === "yes" || getQueryStringValue("simulcast2") === "true");
var acodec = (getQueryStringValue("acodec") !== "" ? getQueryStringValue("acodec") : null);
var vcodec = (getQueryStringValue("vcodec") !== "" ? getQueryStringValue("vcodec") : null);

function getQueryStringValue(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  /* eslint-disable-next-line no-restricted-globals */
  results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function EchoTest() {
  const bitrateOptions = [
    { id: '0', descripcion: 'No limit' },
    { id: '128', descripcion: 'Cap to 128kbit' },
    { id: '256', descripcion: 'Cap to 256kbit' },
    { id: '512', descripcion: 'Cap to 512kbit' },
    { id: '1024', descripcion: 'Cap to 1mbit' },
    { id: '1500', descripcion: 'Cap to 1.5mbit' },
    { id: '2000', descripcion: 'Cap to 2mbit' }
  ];

  const [error, setError] = useState(false);
  const [janusReady, setJanusReady] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [streamLeft, setStreamLeft] = useState(false);
  const [streamRight, setStreamRight] = useState(false);
  const [toggleAudio, setToggleAudio] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(true);
  const [bitrate, setBitrate] = useState(bitrateOptions[0].id);
  const [dataRecive, setDataRecive] = useState('');
  const [curres, setCurres] = useState('');
  const [curbirrate, setCurbirrate] = useState('');
  const refStreamLeft = useRef(null);
  const refStreamRight = useRef(null);

  
  let contCanvas = 0;
  let canvasTimer = null;
  
  const [urlNamePdf, setUrlNamePdf] = useState(null);
  const handFileSystem = (event) => {
    const fileList = event.target.files;
    //readPdfFile(fileList[0]);
    setUrlNamePdf(fileList[0]);
    console.log(fileList);
  };

  const refCanvasStream = useRef(null);
  const refCanvasPage = useRef(null);
  const refFileSelector = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page 

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function goToPrevPage() {
    changePage(-1);
  }

  function goToNextPage() {
    changePage(1);
  }

  function onRenderPage(){
    //grab the context from your destination canvas
    let canvasStream = refCanvasStream.current;
    let destCtx = canvasStream.getContext('2d');
    
    let canvasPage = refCanvasPage.current;
    //call its drawImage() function passing it the source canvas directly
    destCtx.drawImage(canvasPage, 0, 0, canvasStream.width, canvasStream.height);
  }

  useEffect(() => {
    refFileSelector.current.addEventListener('change', handFileSystem);

    canvasTimer = setInterval(function () {
      let canvas = refCanvasStream.current;
      if (canvas !== null){
        let context = canvas.getContext('2d');
        contCanvas = contCanvas + 1;
        if (contCanvas%2){
          context.fillStyle = '#000000'
        }else {
          context.fillStyle = '#BBBBBB'
        }
        context.beginPath()
        context.arc(0, 0, 1, 0, 2*Math.PI)
        context.fill()  
      }
    }, 500);
    //-----------------------------------------------------------------------------
    // Si inicia Janus, la función handleCallback indicara cuando todos este listo
    //-----------------------------------------------------------------------------
    Janus.init({
      debug: true,
      dependencies: Janus.useDefaultDependencies(),
      callback: handleCallback
    });
    return () => { // Desmontado del efecto
      refFileSelector.current.removeEventListener('keydown', handleKeyDown);
      if (bitrateTimer) {
        clearInterval(bitrateTimer);
      }
      bitrateTimer = null;
      if (janus){
        janus.destroy();
      }
    };
  }, []); // Solo se ejecuta una sola vez

  //---------------------------------------------------------------------
  // Función callback luego de iniciar janus (Janus.init)
  // Lo unico que se hace es que se activa un flag (janusReady) para que
  // el formulario quede listo para inciar la video conferencia
  //---------------------------------------------------------------------
  function handleCallback() {
    console.log('Termine de inicilizar Janus');
    setJanusReady(true);
    console.log('Habilitado para continuar');
  }

  //--------------------------------------------------------------------
  // Función que permite crear el objeto Janus e iniciar la transmisión
  //--------------------------------------------------------------------
  function dejarTodoListo(){
    if (Janus.isGetUserMediaAvailable()) {
      console.log('Si se dispone de User Media');
    } else {
      console.log('No se dispone de User Media');
    }

    if (!Janus.isWebrtcSupported()) {
      console.log('WebRTC no esta soportado por su dispositivo');
    } else {
      console.log('WebRTC si esta soportado por su dispositivo');
    }

    if (!janusReady){
      setMensajeError('Componentes no inicados');
      setError(true);
      return;
    }

    //---------------------------------------------------------------------
    // Si llaman a esta funcióm y existe una stream creado siginifica que
    // se el boton esta en DETENER y se tiene que detener los componentes
    //---------------------------------------------------------------------
    if (streamLeft) { 
      setBitrate(bitrateOptions[0].id);
      setCurres('');
      setCurbirrate('');
      if (bitrateTimer) {
        clearInterval(bitrateTimer);
      }
      bitrateTimer = null;

      setToggleAudio(true);
      setToggleVideo(true);
      setStreamRight(false);
      setStreamLeft(false);
      refStreamRight.current.srcObject = null;
      refStreamLeft.current.srcObject = null;
      janus.destroy();
      return;
      //setJanusReady(false); 
    }
    
    //-----------------------------------------------------------------
    // Creamos el objeto Janus que nos permitirá crear los componentes
    //-----------------------------------------------------------------
    janus = new Janus(
      {
        server: server,
        // No "iceServers" is provided, meaning janus.js will use a default STUN server
        // Here are some examples of how an iceServers field may look like to support TURN
        // 		iceServers: [{urls: "turn:yourturnserver.com:3478", username: "janususer", credential: "januspwd"}],
        // 		iceServers: [{urls: "turn:yourturnserver.com:443?transport=tcp", username: "janususer", credential: "januspwd"}],
        // 		iceServers: [{urls: "turns:yourturnserver.com:443?transport=tcp", username: "janususer", credential: "januspwd"}],
        // Should the Janus API require authentication, you can specify either the API secret or user token here too
        //		token: "mytoken",
        //	or
        //		apisecret: "serversecret",
        success: function() {
          // Attach to EchoTest plugin
          janus.attach(
            {
              plugin: "janus.plugin.echotest",
              opaqueId: opaqueId,
              success: successAttach,
              error: function(error) {
                console.error(' -- Error attaching plugin...', error);
                setMensajeError('Error attaching plugin... ' + error);
                setError(true);
              },
              consentDialog: function(on) {
                Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
                if(on) {
                  //Aqui se muestra el efecto de la fecha que ayuda a que el usuario autorice el uso de audio y vodeo
                } else {
                  //Se quita el bloqueo de la pantalla
                }
              },
              iceState: function(state) {
                Janus.log("ICE state changed to " + state);
              },
              mediaState: function(medium, on) {
                Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
              },
              webrtcState: function(on) {
                Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                //$("#videoleft").parent().unblock();
              },
              slowLink: function(uplink, lost) {
                Janus.warn("Janus reports problems " + (uplink ? "sending" : "receiving") +
                  " packets on this PeerConnection (" + lost + " lost packets)");
              },
              onmessage: function(msg, jsep) {
                Janus.debug(" ::: Got a message :::", msg);
                if(jsep) {
                  Janus.debug("Handling SDP as well...", jsep);
                  echotest.handleRemoteJsep({ jsep: jsep });
                }
                var result = msg["result"];
                if(result) {
                  if(result === "done") {
                    // The plugin closed the echo test
                    alert("The Echo Test is over");
                    return;
                  }
                  // Any loss?
                  var status = result["status"];
                  if(status === "slow_link") {
                    console.log("Janus apparently missed many packets we sent, maybe we should reduce the bitrate", "Packet loss?", {timeOut: 2000});
                  }
                }
                // Is simulcast in place?
                var substream = msg["substream"];
                var temporal = msg["temporal"];
                if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                  //if(!simulcastStarted) {
                  //  simulcastStarted = true;
                  //  addSimulcastButtons(msg["videocodec"] === "vp8" || msg["videocodec"] === "h264");
                 // }
                  // We just received notice that there's been a switch, update the buttons
                 // updateSimulcastButtons(substream, temporal);
                }              },
              onlocalstream: function(stream) {
                Janus.debug(" ::: Got a local stream :::");
                Janus.debug(stream);
                //refStreamLeft.current.srcObject = stream;
                //setStreamLeft(true);
                //$("#myvideo").get(0).muted = "muted";
                if(echotest.webrtcStuff.pc.iceConnectionState !== "completed" &&
                    echotest.webrtcStuff.pc.iceConnectionState !== "connected") {
                  // AQUI se debe mostrar un spiner miestas se carga el video de la derecha
                }
                //var videoTracks = stream.getVideoTracks();
                //if(videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
                  // No webcam
                  // No se si mostrar un mensaje que no tiene webcam el dispositovo
                //} else {
                  // Aquo no se debe hacer nada
                //}
              },
              onremotestream: function(stream) {
                Janus.debug(" ::: Got a remote stream :::");
                Janus.debug(stream);
                  // Show the video, hide the spinner and show the resolution when we get a playing event
                var videoTracks = stream.getVideoTracks(); 
                if(videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
                  // No remote video
                  // Aqui hay que mostrar algun mensaje de error creo
                  setStreamRight(false);
                  console.log('seteo a false StreamRight');
                } else {
                  refStreamRight.current.srcObject = stream;
                  setStreamRight(true);
                  console.log('seteo a true StreamRight');
                }

              },
              ondataopen: function(data) {
                //Aqui hay que deshabilitar el data send
                Janus.log("The DataChannel is available!");
              },
              ondata: function(data) {
                // aqui poner el setState para mandar el mensaje
                Janus.debug("We got data from the DataChannel! " + data);
                let posHastack = data.indexOf('||#*#||');
                if (posHastack > 0){
                  data = data.substr(posHastack + 7);
                }
                setDataRecive(data);
              },
              oncleanup: function() {
                Janus.log(" ::: Got a cleanup notification :::");
                if(bitrateTimer)
                  clearInterval(bitrateTimer);
                bitrateTimer = null;
                console.log('Dentro de onCleanup');
              }
            });
        },
        error: function(error) {
          //Janus.error(error);
          setMensajeError("Algun error " + error);
          setError(true);
        },
        destroyed: function() {
          window.location.reload();
        }
      }); 
  }

  //----------------------------------------------------------
  // Funcion invocada dentro de la creación del objeto Janus
  //----------------------------------------------------------
  function successAttach(pluginHandle) {
    //$('#details').remove();
    echotest = pluginHandle;

    let canvas = refCanvasStream.current; 
    let canvasStream = canvas.captureStream();

    Janus.log("Plugin attached! (" + echotest.getPlugin() + ", id=" + echotest.getId() + ")");
    // Negotiate WebRTC
    var body = { "audio": false, "video": true };
    // We can try and force a specific codec, by telling the plugin what we'd prefer
    // For simplicity, you can set it via a query string (e.g., ?vcodec=vp9)
    if(acodec)
      body["audiocodec"] = acodec;
    if(vcodec)
      body["videocodec"] = vcodec;
    Janus.debug("Sending message (" + JSON.stringify(body) + ")");
    echotest.send({"message": body});
    Janus.debug("Trying a createOffer too (audio/video sendrecv)");


    echotest.createOffer(
      {
        // No media provided: by default, it's sendrecv for audio and video
        stream: canvasStream,	// Let's negotiate data channels as well
        // If you want to test simulcasting (Chrome and Firefox only), then
        // pass a ?simulcast=true when opening this demo page: it will turn
        // the following 'simulcast' property to pass to janus.js to true
        simulcast: doSimulcast,
        simulcast2: doSimulcast2,
        success: function(jsep) {
          Janus.debug("Got SDP!");
          Janus.debug(jsep);
          echotest.send({"message": body, "jsep": jsep});
        },
        error: function(error) {
          Janus.error("WebRTC error:", error);
          setMensajeError("WebRTC error... " + JSON.stringify(error));
          setError(true);
        }
      });
  }

  //----------------------------------------
  // Funciones utilizadas en elementos html
  //----------------------------------------
  function clickToggleAudio(){
    const newVal = !toggleAudio;
    setToggleAudio(newVal);
    echotest.send({"message": { "audio": newVal }});
  }

  function clickToggleVideo(){
    const newVal = !toggleVideo;
    setToggleVideo(newVal);
    echotest.send({"message": { "video": newVal }});
    if (!newVal){
      refStreamRight.current.srcObject = null;
    }
  }

  function clickBitrate(value) {
    console.log(value);
    const bitrateTmp = parseInt(value) * 1000;
    if (bitrateTmp === 0) {
      Janus.log("Not limiting bandwidth via REMB");
    } else {
      Janus.log("Capping bandwidth to " + bitrateTmp + " via REMB");
    }
    setBitrate(value);
    echotest.send({ "message": { "bitrate": bitrateTmp } });

    if (Janus.webRTCAdapter.browserDetails.browser === "chrome" || Janus.webRTCAdapter.browserDetails.browser === "firefox" ||
      Janus.webRTCAdapter.browserDetails.browser === "safari") {
      bitrateTimer = setInterval(function () {
        var bitrate = echotest.getBitrate();
        Janus.debug("Current bitrate is " + echotest.getBitrate());
        setCurbirrate(bitrate);
        var width = refStreamRight.current.videoWidth;
        var height = refStreamRight.current.videoHeight;
        setCurres(width+'x'+height);
      }, 1000);
    }
  }

  function handleSendMessageError(reason) {
    setMensajeError('Error al enviar mensaje: ' + reason);
    setError(true);
  }

  function sendMessage(mensaje) {
    if (mensaje === '') {
      setMensajeError('Ingrese en mensaje a enviar');
      setError(true);
    } else {
      mensaje = '||#*#||' + mensaje; 
      echotest.data({
        text: mensaje,
        error: handleSendMessageError,
        success: function() {  },
      });  
    }
  }
  
  return (
    <div>
      <div>
        {(error) ? <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {mensajeError}
        </Alert> : " "}
      </div>
      <div>
        {(isMobile) ?<h1> This is rendered only in mobile </h1>:<h1> This is rendered only on Browse </h1>}
      </div>
      <div>
        <h1>Plugin Demo: Echo Test</h1>
        <Button
            color="secondary"
            disabled={!janusReady}
            size="large"
            type="button"
            variant="contained"
            onClick={() => dejarTodoListo()}
          >
            {(!streamLeft)?'Iniciar':'Detener'}
        </Button>
      </div>
      <div>
        <Input
           type ="file"
           multiple
           ref={refFileSelector}
        >
        </Input>
      </div>
      <div>
        <nav>
          <button onClick={goToPrevPage}>Prev</button>
          <button onClick={goToNextPage}>Next</button>
        </nav>
        <div style={{ width: 600 }}>
          <Document
            file={urlNamePdf}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page 
              pageNumber={pageNumber} height ={240} width={432} 
              canvasRef={refCanvasPage}
              onRenderSuccess={onRenderPage}
            />
          </Document>
        </div>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
      <div hidden={true}>
         <canvas ref={refCanvasStream}></canvas>
      </div>
      <div id="videos">
        <div>
          <h3>Local Stream</h3>
          <Button
            color="secondary"
            disabled={!streamLeft}
            size="large"
            type="button"
            variant="contained"
            onClick={() => clickToggleAudio()}
          >
            {toggleAudio?'Disable audio':'Enable audio'}
          </Button>
          <Button
            color="secondary"
            disabled={!streamLeft}
            size="large"
            type="button"
            variant="contained"
            onClick={() => clickToggleVideo()}
          >
            {toggleVideo?'Disable video':'Enable video'}
          </Button>
          <TextField
            width="20%"
            name="option"
            label="Bandwidth"
            disabled={!streamLeft}
            onChange={(event) => clickBitrate(event.target.value)}
            select
            SelectProps={{ native: true }}
            value={bitrate}
            variant="outlined"
          >
            {bitrateOptions.map((option) => (
              <option
                key={option.id}
                value={option.id}
              >
                {option.descripcion}
              </option>
            ))}
          </TextField>
        </div>
        <div id="videoleft">
        <video id="myvideo" ref={refStreamLeft} width='320' height='240' autoPlay playsInline muted="muted"/>
        </div>
        <div>
        <TextField
            width="30%"
            disabled={!streamLeft}
            label="Mesaje a enviar"
            margin="normal"
            name="datasend"
            id="datasend"
            type="text"
            variant="outlined"
          />
          <Button
            color="secondary"
            disabled={!streamLeft}
            size="large"
            type="button"
            variant="contained"
            onClick={() => sendMessage(datasend.value)}
          >
            Enviar
          </Button>
        </div>
        <div>
            <h3>Remote Stream {(streamRight)?' [curres:' + curres + ' curbitrate:' + curbirrate + ']':''}</h3>
          
          <div id="videoright">
          <video id="peervideo" ref={refStreamRight} width='320' height='240' autoPlay playsInline/>
          </div>
          <div>
          <TextField
            disabled
            label="Mensaje recibido"
            margin="normal"
            name="datarecv"
            id="datarecv"
            type="text"
            variant="outlined"
            value={dataRecive}
          />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EchoTest;