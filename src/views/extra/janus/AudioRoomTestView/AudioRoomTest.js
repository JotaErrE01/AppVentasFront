/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-else-return */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { useState, useEffect, useRef } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Button, TextField } from '@material-ui/core';
import { fgDigitalConfig } from 'src/config';

//--------------------------------------------------------------
// Janus Gateway: Variables globales para acceso de renderizado
//--------------------------------------------------------------
const server = fgDigitalConfig.server_rtc;
//https://rtc01.multicommerce.online:8089/janus
//const server = "wss://rtc01.multicommerce.online:8989/janus";

let janusAudio = null;
let mixertest = null;
const opaqueId = "audiobridgetest-"+Janus.randomString(12);

let myroom = 1234;	// Demo room
if(getQueryStringValue("room") !== "")
	myroom = parseInt(getQueryStringValue("room"));
let myusername = null;
let myid = null;
let webrtcUp = false;

let dataParticipants = [];

let idDeviceInputAudio = null;
let idDeviceOutputAudio = null;
let idDeviceInputVideo = null;

let deviceInputAudio = [];
let deviceInputVideo = [];
let deviceOutputAudio = [];

const doSimulcast = (getQueryStringValue("simulcast") === "yes" || getQueryStringValue("simulcast") === "true");
const doSimulcast2 = (getQueryStringValue("simulcast2") === "yes" || getQueryStringValue("simulcast2") === "true");

function getQueryStringValue(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  /* eslint-disable-next-line no-restricted-globals */
  results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function AudioRoomTest() {
  const [listParticipants, setListParticipants] = useState("");

  const [isMobile, setMobile] = useState(false);
  const [error, setError] = useState(false);
  const [janusReady, setJanusReady] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const [nameUserJoin, setNameUserJoin] = useState("");
  const [viewSelectDevice, setViewSelectDevice] = useState(false);
  const [viewJoinRoom, setViewJoinRoom] = useState(false);
  const [viewParticipans, setViewParticioants] = useState(false);
  const [toggleMute, setToggleMute] = useState(false);
  
  const refStreamAudioRoom = useRef(null);

  useEffect(() => {
    //-----------------------------------------------------------------------------
    // Si inicia Janus, la función handleCallback indicara cuando todos este listo
    //-----------------------------------------------------------------------------
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    setMobile(mobile);

    Janus.init({
      debug: true,
      dependencies: Janus.useDefaultDependencies(),
      callback: handleCallback
    });
    return () => { // Desmontado del efecto
      for(let i=1;i<6;i++) {
        //jj if (bitrateTimer[i]) {
          //jj clearInterval(bitrateTimer[i]);
        //jj }
        //jj bitrateTimer[i] = null;
      }
      if (janusAudio){
        janusAudio.destroy();
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

		if(userName === "") {
      alert("Insert a username to register (e.g., pippo)");
			return;
		}
		if(/[^a-zA-Z0-9]/.test(userName)) {
      alert("Los caracteres deben ser alfanumericos");
			return;
    }
    var username = userName;
    var register = { request: "join", room: myroom, display: username };
    myusername = username;
    mixertest.send({ message: register});
  }


  function doToggleMute() {
    const newVal = !toggleMute;
    mixertest.send({ message: { request: "configure", muted: newVal }});
    setToggleMute(newVal);
  }
  
  //--------------------------------------------------------------------
  // Función que permite obtener un arreglo de los devices del equipo
  //--------------------------------------------------------------------
function initDevices(devices) {
	devices.forEach(function(device) {
		var label = device.label;
		if(!label || label === "")
			label = device.deviceId;
		//var option = $('<option value="' + device.deviceId + '">' + label + '</option>');
		if(device.kind === 'audioinput') {
      //alert('recuerso ' + label);
      deviceInputAudio.push({id: device.deviceId, viewValue: label});
			//$('#audio-device').append(option);
		} else if(device.kind === 'videoinput') {
      deviceInputVideo.push({id: device.deviceId, viewValue: label});
			//$('#video-device').append(option);
		} else if(device.kind === 'audiooutput') {
			// Apparently only available from Chrome 49 on?
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId
      // Definitely missing in Safari at the moment: https://bugs.webkit.org/show_bug.cgi?id=179415
      deviceOutputAudio.push({id: device.deviceId, viewValue: label});
		}
	});

  if (deviceOutputAudio.length === 0){ //ocurre en safary y firefox
    deviceOutputAudio.push({id: "default", viewValue: "Defaul Speaker"});
  }
  //if(Janus.webRTCAdapter.browserDetails.browser === "safari" || Janus.webRTCAdapter.browserDetails.browser === "firefox"){  //Safari y firefox no permite el uso de esto
  //  deviceOutputAudio.push({id: "default", viewValue: "Defaul Speaker"});
  //}

  idDeviceInputAudio = deviceInputAudio[0].id;
  idDeviceOutputAudio = deviceOutputAudio[0].id;
  idDeviceInputVideo = deviceInputVideo[0].id;

  setViewSelectDevice(true);
}

function publishOwnFeed(valueAudioIn, valueVideoIn, valueAudioOut) {
  let replaceAudio = idDeviceInputAudio !== valueAudioIn;
  idDeviceInputAudio = valueAudioIn;
  let replaceVideo = idDeviceInputVideo !== valueVideoIn;
  idDeviceInputVideo = valueVideoIn;

  mixertest.createOffer(
    {
      media: { video: false,
        audio: {
          deviceId: {
            exact: idDeviceInputAudio
          }
        },
        replaceAudio: replaceAudio},	// This is an audio only room
      success: function(jsep) {
        Janus.debug("Got SDP!", jsep);
        var publish = { request: "configure", muted: false };
        mixertest.send({ message: publish, jsep: jsep });
      },
      error: function(error) {
        Janus.error("WebRTC error:", error);
        bootbox.alert("WebRTC error... " + error.message);
      }
    });
}

  function mostrarParticipantes(list){
    for(var f in list) {
      var id = list[f]["id"];
      var display = list[f]["display"];
      var setup = list[f]["setup"];
      var muted = list[f]["muted"];
      var talking = list[f]["talking"];
      Janus.debug("  >> [" + id + "] " + display + " (setup=" + setup + ", muted=" + muted + ")");
      let statusParticipant = display;
      if(muted === true || muted === "true")
        statusParticipant = statusParticipant + ": MUTE";
      else
        statusParticipant = statusParticipant + ": unMUTE";

      if(setup === true || setup === "true")
        statusParticipant = statusParticipant + "|Conectado";
      else
        statusParticipant = statusParticipant + "|Desconectado";
      
      if(talking === true || talking === "true")
        statusParticipant = statusParticipant + "|Hablando";
      else
        statusParticipant = statusParticipant + "|Callado";

      if (dataParticipants.length === 0) {
        dataParticipants.push({id: id, viewValue: statusParticipant});
      } else {
        let noExiste = true;
        for (let i = 0; i < dataParticipants.length; i++) {
          if (dataParticipants[i].id === id){
            dataParticipants[i].viewValue = statusParticipant;
            noExiste = false;
          }
        }
        if (noExiste){
          dataParticipants.push({id: id, viewValue: statusParticipant});
        }
      }
    }
    let textParticipants = ""
    for (let i = 0; i < dataParticipants.length; i++) {
      textParticipants = textParticipants + dataParticipants[i].viewValue + "<br>";
    }
    setListParticipants(textParticipants);
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
    if (viewParticipans) { 
      setViewParticioants(false);
      setViewJoinRoom(false);
      janusAudio.destroy();
      return;
    }
    
    //-----------------------------------------------------------------
    // Creamos el objeto Janus que nos permitirá crear los componentes
    //-----------------------------------------------------------------
    janusAudio = new Janus(
      {
        server: server,
        success: function() {
          janusAudio.attach(
            {
              plugin: "janus.plugin.audiobridge",
              opaqueId: opaqueId,
              success: function(pluginHandle) {
                //$('#details').remove();
                mixertest = pluginHandle;
                Janus.log("Plugin attached! (" + mixertest.getPlugin() + ", id=" + mixertest.getId() + ")");
                // Enumerate devices: that's what we're here for
								Janus.listDevices(initDevices);	
                // Prepare the username registration
                setViewJoinRoom(true);
              },
              error: function(error) {
                Janus.error("  -- Error attaching plugin...", error);
                alert("Error attaching plugin... " + error);
              },
              consentDialog: function(on) {
                Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
                if(on) {
                  // Darken screen and show hint
                  // Aqui se puedes mostrar el dialogo personalizado de concentimiento
                } else {
                  // Restore screen
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
              },
              onmessage: function(msg, jsep) {
                console.log("JIMJOU");
                console.log(msg);
                Janus.debug(" ::: Got a message :::", msg);
                var event = msg["audiobridge"];
                Janus.debug("Event: " + event);
                if(event) {
                  if(event === "joined") {
                    // Successfully joined, negotiate WebRTC now
                    if(msg["id"]) {
                      myid = msg["id"];
                      Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);
                      if(!webrtcUp) {
                        webrtcUp = true;
                        // Publish our stream
                        publishOwnFeed(idDeviceInputAudio, idDeviceInputVideo, idDeviceOutputAudio);
                      }
                    }
                    // Any room participant?
                    if(msg["participants"]) {
                      var list = msg["participants"];
                      Janus.debug("Got a list of participants:", list);
                      mostrarParticipantes(list);
                    }
                  } else if(event === "roomchanged") {
                    // The user switched to a different room
                    myid = msg["id"];
                    Janus.log("Moved to room " + msg["room"] + ", new ID: " + myid);
                    // Any room participant?
                    //$('#list').empty();
                    if(msg["participants"]) {
                      var list = msg["participants"];
                      Janus.debug("Got a list of participants:", list);
                      mostrarParticipantes(list);
                    }
                  } else if(event === "destroyed") {
                    // The room has been destroyed
                    Janus.warn("The room has been destroyed!");
                    alert("The room has been destroyed", function() {
                      window.location.reload();
                    });
                  } else if(event === "event") {
                    if(msg["participants"]) {
                      var list = msg["participants"];
                      Janus.debug("Got a list of participants:", list);
                      mostrarParticipantes(list);
                    } else if(msg["error"]) {
                      if(msg["error_code"] === 485) {
                        // This is a "no such room" error: give a more meaningful description
                        alert(
                          "<p>Apparently room <code>" + myroom + "</code> (the one this demo uses as a test room) " +
                          "does not exist...</p><p>Do you have an updated <code>janus.plugin.audiobridge.jcfg</code> " +
                          "configuration file? If not, make sure you copy the details of room <code>" + myroom + "</code> " +
                          "from that sample in your current configuration file, then restart Janus and try again."
                        );
                      } else {
                        bootbox.alert(msg["error"]);
                      }
                      return;
                    }
                    // Any new feed to attach to?
                    if(msg["leaving"]) {
                      // One of the participants has gone away?
                      var leaving = msg["leaving"];
                      Janus.log("Participant left: " + leaving + " (we have " + dataParticipants.length + " elements with ID " +leaving + ")");

                      let tempList = [];  
                      if (dataParticipants.length !== 0) {
                        for (let i = 0; i < dataParticipants.length; i++) {
                          if (dataParticipants[i].id === leaving){
                            dataParticipants.splice(i, 1);
                            break;
                          }
                        }
                      }
                      let textParticipants = "";
                      for (let i = 0; i < dataParticipants.length; i++) {
                        textParticipants = textParticipants + dataParticipants[i].viewValue + "<br>";
                      }
                      setListParticipants(textParticipants);
                      //$('#rp'+leaving).remove();
                    }
                  }
                }
                if(jsep) {
                  Janus.debug("Handling SDP as well...", jsep);
                  mixertest.handleRemoteJsep({ jsep: jsep });
                }
              },
              onlocalstream: function(stream) {
                Janus.debug(" ::: Got a local stream :::", stream);
                // We're not going to attach the local audio stream

                setViewJoinRoom(false);
                setViewParticioants(true);
                setNameUserJoin(myusername);

                //$('#audiojoin').hide();
                //$('#room').removeClass('hide').show();
                //$('#participant').removeClass('hide').html(myusername).show();
              },
              onremotestream: function(stream) {
                //$('#room').removeClass('hide').show();
                var addButtons = false;
                //if($('#roomaudio').length === 0) {
                  addButtons = true;
                //  $('#mixedaudio').append('<audio class="rounded centered" id="roomaudio" width="100%" height="100%" autoplay/>');
                //}
                refStreamAudioRoom.current.srcObject = stream;
                //Janus.attachMediaStream($('#roomaudio').get(0), stream);
                if(!addButtons)
                  return;
              },
              oncleanup: function() {
                webrtcUp = false;
                Janus.log(" ::: Got a cleanup notification :::");
                setViewJoinRoom(true);
                setViewParticioants(false);
                setNameUserJoin("");
                //$('#participant').empty().hide();
                //$('#list').empty();
                //$('#mixedaudio').empty();
                //$('#room').hide();
              }
            });
        },
        error: function(error) {
          Janus.error(error);
          setMensajeError("Algun error " + error);
          setError(true);
        },
        destroyed: function() {
          window.location.reload();
        }
      }); 

      
  }

  //----------------------------------------
  // Funciones utilizadas en elementos html
  //----------------------------------------
  function clickToggleMute(){
    doToggleMute();
  }

  function clickChangeDevice(valueAudioIn, valueVideoIn, valueAudioOut){
    //alert("adioIn=>" + valueAudioIn + " videoIn=>" + valueVideoIn + "audioOut=>" + valueAudioOut);
    publishOwnFeed(valueAudioIn, valueVideoIn, valueAudioOut);  
    refStreamAudioRoom.current.setSinkId(valueAudioOut);
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

        <h1>Plugin Demo: Audio Room Test:</h1>
        <div>
          <Button
            color="secondary"
            disabled={false}
            size="large"
            type="button"
            variant="contained"
            onClick={() => dejarTodoListo()}
          >
            {(!viewJoinRoom && !viewParticipans) ? 'Iniciar' : 'Detener'}
          </Button>
        </div>
        <div hidden={!viewJoinRoom}>
          <TextField
            width="30%"
            label="Nick name"
            margin="normal"
            name="username"
            id="username"
            type="text"
            variant="outlined"
          />
          <Button // registrar
            color="secondary"
            disabled={false}
            size="large"
            type="button"
            variant="contained"
            onClick={() => registerUsername(username.value)}
          >
            Registrar
          </Button>
        </div>  
        {viewSelectDevice ? 
        <div>
          <TextField
              width="20%"
              name="optionAudioIn"
              id="optionAudioIn"
              label="Microfono"
              disabled={false}
              select
              SelectProps={{ native: true }}
              variant="outlined"
            >
              {deviceInputAudio.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                >
                  {option.viewValue}
                </option>
              ))}
          </TextField>
          <TextField
              width="20%"
              name="optionAudioOut"
              id="optionAudioOut"
              label="Parlantes"
              disabled={false}
              select
              SelectProps={{ native: true }}
              variant="outlined"
            >
              {deviceOutputAudio.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                >
                  {option.viewValue}
                </option>
              ))}
          </TextField>
          <TextField
              width="20%"
              name="optionVideoIn"
              id="optionVideoIn"
              label="Cámara"
              disabled={false}
              select
              SelectProps={{ native: true }}
              variant="outlined"
            >
              {deviceInputVideo.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                >
                  {option.viewValue}
                </option>
              ))}
          </TextField>
        </div>
        :null}  
        {viewParticipans ? 
        <div>
          <Button // cambiar
            color="secondary"
            disabled={false}
            size="large"
            type="button"
            variant="contained"
            onClick={() => clickChangeDevice(optionAudioIn.value, optionVideoIn.value, optionAudioOut.value)}
          >
            Cambiar
          </Button>
        </div>
        :null}  
      </div>  
      <div id="participans" hidden={!viewParticipans}>
        <div id="divVideoLocal">
          <h3>Su nombre: {nameUserJoin}</h3>

            <Button
              color="secondary"
              disabled={false}
              size="large"
              type="button"
              variant="contained"
              onClick={() => clickToggleMute()}
            >
              {toggleMute ? 'UnMute' : 'Mute'}
            </Button>
            <div hidden={!viewParticipans}>
              <audio id="roomaudio" ref={refStreamAudioRoom} width='80' height='80' autoPlay/>
            </div>
          <div>
              <h3>Lista de participante {listParticipants}</h3>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default AudioRoomTest;