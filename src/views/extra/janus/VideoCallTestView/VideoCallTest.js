/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-else-return */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { useState, useEffect, useRef } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Button, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { fgDigitalConfig } from 'src/config';

//--------------------------------------------------------------
// Janus Gateway: Variables globales para acceso de renderizado
//--------------------------------------------------------------
const server = fgDigitalConfig.server_rtc;

var janusVC = null;
var videocall = null;
var opaqueId = "videocalltest-"+Janus.randomString(12);

var bitrateTimer = null;
var myusername = null;
var yourusername = null;

var doSimulcast = (getQueryStringValue("simulcast") === "yes" || getQueryStringValue("simulcast") === "true");
var doSimulcast2 = (getQueryStringValue("simulcast2") === "yes" || getQueryStringValue("simulcast2") === "true");

var globalJsep; 

function getQueryStringValue(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  /* eslint-disable-next-line no-restricted-globals */
  results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function VideoCallTest() {
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

  const [openCallMessage, setOpenCallMessage] = React.useState(false);

  
  const handleHangUpCall = () => {
    doHangup();
    setOpenCallMessage(false);
  };


  const handleAnswerCall = () => {
    //incoming = null;
    const jsep = globalJsep;
    videocall.createAnswer(
      {
        jsep: jsep,
        // No media provided: by default, it's sendrecv for audio and video
        media: { data: true },	// Let's negotiate data channels as well
        // If you want to test simulcasting (Chrome and Firefox only), then
        // pass a ?simulcast=true when opening this demo page: it will turn
        // the following 'simulcast' property to pass to janus.js to true
        simulcast: doSimulcast,
        success: function (jsep) {
          Janus.debug("Got SDP!");
          Janus.debug(jsep);
          var body = { "request": "accept" };
          videocall.send({ "message": body, "jsep": jsep });
          // Aqui debe desactivase el born de llamar y habilitar el boton colcar
          //$('#peer').attr('disabled', true);
          //$('#call').removeAttr('disabled').html('Hangup')
          //  .removeClass("btn-success").addClass("btn-danger")
          //  .unbind('click').click(doHangup);
        },
        error: function (error) {
          Janus.error("WebRTC error:", error);
          alert("WebRTC error... " + JSON.stringify(error));
        }
      });
    setOpenCallMessage(false);
  };

  useEffect(() => {
    //-----------------------------------------------------------------------------
    // Si inicia Janus, la función handleCallback indicara cuando todos este listo
    //-----------------------------------------------------------------------------
    Janus.init({
      debug: true,
      dependencies: Janus.useDefaultDependencies(),
      callback: handleCallback
    });
    return () => { // Desmontado del efecto
      if (bitrateTimer) {
        clearInterval(bitrateTimer);
      }
      bitrateTimer = null;
      if (janusVC){
        janusVC.destroy();
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

  function registerUsername(userName) {
    // Try a registration
    if (userName === "") {
      alert("Insert a username to register (e.g., pippo)");
      return;
    }
    if (/[^a-zA-Z0-9]/.test(userName)) {
      alert('Input is not alphanumeric');
      return;
    }
    const register = { "request": "register", "username": userName };
    videocall.send({"message": register});
  }

  function doCall(userName) {
    // Call someone
    if(userName === "") {
      alert("Insert a username to call (e.g., pluto)");
      return;
    }
    if(/[^a-zA-Z0-9]/.test(userName)) {
      alert('Input is not alphanumeric');
      return;
    }
    // Call this user
    videocall.createOffer(
      {
        // By default, it's sendrecv for audio and video...
        media: { data: true },	// ... let's negotiate data channels as well
        // If you want to test simulcasting (Chrome and Firefox only), then
        // pass a ?simulcast=true when opening this demo page: it will turn
        // the following 'simulcast' property to pass to janus.js to true
        simulcast: doSimulcast,
        success: function(jsep) {
          Janus.debug("Got SDP!");
          Janus.debug(jsep);
          var body = { "request": "call", "username": userName };
          videocall.send({"message": body, "jsep": jsep});
        },
        error: function(error) {
          Janus.error("WebRTC error...", error);
          alert("WebRTC error... " + error);
        }
      });
  }

  function doHangup() {
    // Hangup a call
    var hangup = { "request": "hangup" };
    videocall.send({"message": hangup});
    videocall.hangup();
    yourusername = null;
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
      refStreamLeft.current.srcObject = null;
      setStreamLeft(false);
      refStreamRight.current.srcObject = null;
      setStreamRight(false);
      janusVC.destroy();
      return;
      //setJanusReady(false); 
    }
    
    //-----------------------------------------------------------------
    // Creamos el objeto Janus que nos permitirá crear los componentes
    //-----------------------------------------------------------------
    janusVC = new Janus(
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
          // Attach to videocall plugin
          janusVC.attach(
            {
              plugin: "janus.plugin.videocall",
              opaqueId: opaqueId,
              success: function(pluginHandle) {
                videocall = pluginHandle;
                Janus.log("Plugin attached! (" + videocall.getPlugin() + ", id=" + videocall.getId() + ")");
              },
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
                Janus.debug(" ::: Got a message :::");
                Janus.debug(msg);
                var result = msg["result"];
                if(result !== null && result !== undefined) {
                  if(result["list"] !== undefined && result["list"] !== null) {
                    var list = result["list"];
                    Janus.debug("Got a list of registered peers:");
                    Janus.debug(list);
                    for(var mp in list) {
                      Janus.debug("  >> [" + list[mp] + "]");
                    }
                  } else if(result["event"] !== undefined && result["event"] !== null) {
                    var event = result["event"];
                    if(event === 'registered') {
                      myusername = result["username"];
                      Janus.log("Successfully registered as " + myusername + "!");
                      //Aqui se puede mostrar un mensaje de que fue correctamente registrado
                      //$('#youok').removeClass('hide').show().html("Registered as '" + myusername + "'");
                      // Get a list of available peers, just for fun
                      videocall.send({"message": { "request": "list" }});
                      // TODO Enable buttons to call now
                      // Aqui deberia habilitarse el el input y el boton para llamar
                      //$('#phone').removeClass('hide').show();
                      //$('#call').unbind('click').click(doCall);
                      //$('#peer').focus();
                    } else if(event === 'calling') {
                      Janus.log("Waiting for the peer to answer...");
                      // TODO Any ringtone?
                      alert("Waiting for the peer to answer...");
                    } else if(event === 'incomingcall') {
                      Janus.log("Incoming call from " + result["username"] + "!");
                      yourusername = result["username"];
                      // Notify user
                      setOpenCallMessage(true);
                      globalJsep = jsep; //Puesto para exportar variable
                      //bootbox.hideAll();
                      //incoming = bootbox.dialog( );
                    } else if(event === 'accepted') {
                      //bootbox.hideAll();
                      var peer = result["username"];
                      if(peer === null || peer === undefined) {
                        Janus.log("Call started!");
                      } else {
                        Janus.log(peer + " accepted the call!");
                        yourusername = peer;
                      }
                      // Video call can start
                      if(jsep)
                        videocall.handleRemoteJsep({jsep: jsep});
                        // Aqui se deberia habilitar el boton de colgar
                      //$('#call').removeAttr('disabled').html('Hangup')
                      //  .removeClass("btn-success").addClass("btn-danger")
                      //  .unbind('click').click(doHangup);
                    } else if(event === 'update') {
                      // An 'update' event may be used to provide renegotiation attempts
                      if(jsep) {
                        if(jsep.type === "answer") {
                          videocall.handleRemoteJsep({jsep: jsep});
                        } else {
                          videocall.createAnswer(
                            {
                              jsep: jsep,
                              media: { data: true },	// Let's negotiate data channels as well
                              success: function(jsep) {
                                Janus.debug("Got SDP!");
                                Janus.debug(jsep);
                                var body = { "request": "set" };
                                videocall.send({"message": body, "jsep": jsep});
                              },
                              error: function(error) {
                                Janus.error("WebRTC error:", error);
                                alert("WebRTC error... " + JSON.stringify(error));
                              }
                            });
                        }
                      }
                    } else if(event === 'hangup') {
                      Janus.log("Call hung up by " + result["username"] + " (" + result["reason"] + ")!");
                      // Reset status
                      //bootbox.hideAll();
                      videocall.hangup();
                      //if(spinner !== null && spinner !== undefined)
                      //  spinner.stop();
                      // Aqui deben desactivarse los botones
                      //$('#waitingvideo').remove();
                      //$('#videos').hide();
                      //$('#peer').removeAttr('disabled').val('');
                      //$('#call').removeAttr('disabled').html('Call')
                      //  .removeClass("btn-danger").addClass("btn-success")
                      //  .unbind('click').click(doCall);
                      //$('#toggleaudio').attr('disabled', true);
                      //$('#togglevideo').attr('disabled', true);
                      //$('#bitrate').attr('disabled', true);
                      //$('#curbitrate').hide();
                      //$('#curres').hide();
                    } else if(event === "simulcast") {
                      // Is simulcast in place?
                      // Por ahora no estamos usando simulcast
                      /*var substream = result["substream"];
                      var temporal = result["temporal"];
                      if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                        if(!simulcastStarted) {
                          simulcastStarted = true;
                          addSimulcastButtons(result["videocodec"] === "vp8" || result["videocodec"] === "h264");
                        }
                        // We just received notice that there's been a switch, update the buttons
                        updateSimulcastButtons(substream, temporal);
                      }*/
                    }
                  }
                } else {
                  // FIXME Error?
                  var error = msg["error"];
                  alert(error);
                  if(error.indexOf("already taken") > 0) {
                    // FIXME Use status codes...
                    //$('#username').removeAttr('disabled').val("");
                    //$('#register').removeAttr('disabled').unbind('click').click(registerUsername);
                  }
                  // TODO Reset status
                  videocall.hangup();
                  //if(spinner !== null && spinner !== undefined)
                  //  spinner.stop();
                  // Aqui deberia desabilitatse todo
                  /*$('#waitingvideo').remove();
                  $('#videos').hide();
                  $('#peer').removeAttr('disabled').val('');
                  $('#call').removeAttr('disabled').html('Call')
                    .removeClass("btn-danger").addClass("btn-success")
                    .unbind('click').click(doCall);
                  $('#toggleaudio').attr('disabled', true);
                  $('#togglevideo').attr('disabled', true);
                  $('#bitrate').attr('disabled', true);
                  $('#curbitrate').hide();
                  $('#curres').hide();*/
                  if(bitrateTimer !== null && bitrateTimer !== null)
                    clearInterval(bitrateTimer);
                  bitrateTimer = null;
                }
              },
              onlocalstream: function(stream) {
                Janus.debug(" ::: Got a local stream :::");
                Janus.debug(stream);
                refStreamLeft.current.srcObject = stream;
                setStreamLeft(true);
                //$("#myvideo").get(0).muted = "muted";
                if(videocall.webrtcStuff.pc.iceConnectionState !== "completed" &&
                   videocall.webrtcStuff.pc.iceConnectionState !== "connected") {
                  // AQUI se debe mostrar un spiner miestas se carga el video de la derecha
                }
                var videoTracks = stream.getVideoTracks();
                if(videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
                  // No webcam
                  // No se si mostrar un mensaje que no tiene webcam el dispositovo
                } else {
                  // Aquo no se debe hacer nada
                }
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
                //let posHastack = data.indexOf('||#*#||');
                //if (posHastack > 0){
                //  data = data.substr(posHastack + 7);
                //}
                setDataRecive(data);
              },
              oncleanup: function() {
                Janus.log(" ::: Got a cleanup notification :::");
                yourusername = null;
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
          //window.location.reload();
        }
      }); 
  }


  //----------------------------------------
  // Funciones utilizadas en elementos html
  //----------------------------------------
  function clickToggleAudio(){
    const newVal = !toggleAudio;
    setToggleAudio(newVal);
    videocall.send({"message": { request: "set", audio: newVal }});
  }

  function clickToggleVideo(){
    const newVal = !toggleVideo;
    setToggleVideo(newVal);
    videocall.send({"message": { request: "set", video: newVal }});
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
    videocall.send({ "message": { "bitrate": bitrateTmp } });

    if (Janus.webRTCAdapter.browserDetails.browser === "chrome" || Janus.webRTCAdapter.browserDetails.browser === "firefox" ||
      Janus.webRTCAdapter.browserDetails.browser === "safari") {
      bitrateTimer = setInterval(function () {
        var bitrate = videocall.getBitrate();
        Janus.debug("Current bitrate is " + videocall.getBitrate());
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
      //mensaje = '||#*#||' + mensaje; 
      videocall.data({
        text: mensaje,
        error: handleSendMessageError,
        success: function() {  },
      });  
    }
  }
  
  return (
    <div>
      <div>
        <Dialog
          open={openCallMessage}
          onClose={handleHangUpCall}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Llamada entrante"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Tiene una llamada entrante.
        </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleHangUpCall} color="primary">
              Rechazar
        </Button>
            <Button onClick={handleAnswerCall} color="primary" autoFocus>
              Contestar
        </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        {(error) ? <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {mensajeError}
        </Alert> : " "}
      </div>
      <div>
        <h1>Plugin Demo: Video Call Test :
        <Button
            color="secondary"
            disabled={!janusReady}
            size="large"
            type="button"
            variant="contained"
            onClick={() => dejarTodoListo()}
          >
            {(!streamLeft)?'Iniciar':'Detener'}
        </Button></h1>        
        <div>
        <TextField
            width="30%"
            label="Nick name"
            margin="normal"
            name="username"
            id="username"
            type="text"
            variant="outlined"
        />
        <Button // youok
            color="secondary"
            disabled={!janusReady}
            size="large"
            type="button"
            variant="contained"
            onClick={() => registerUsername(username.value)}
          >
            Registrar
        </Button>
        <Button // doHangup
            color="secondary"
            disabled={!janusReady}
            size="large"
            type="button"
            variant="contained"
            onClick={() => doHangup()}
          >
            Colgar
        </Button>
        </div>
        <div>
        <TextField
            width="30%"
            label="A quien deseas llamar?"
            margin="normal"
            name="peer"
            id="peer"
            type="text"
            variant="outlined"
        />
        <Button // call
            color="secondary"
            disabled={!janusReady}
            size="large"
            type="button"
            variant="contained"
            onClick={() => doCall(peer.value)}
          >
            Llamar
        </Button>
        
        </div>
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

export default VideoCallTest;