/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-else-return */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { useState, useEffect, useRef } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Button, TextField } from '@material-ui/core';
import { fgDigitalConfig } from 'src/config';
import { ContactSupportOutlined, Sync } from '@material-ui/icons';
import { number } from 'prop-types';

//--------------------------------------------------------------
// Janus Gateway: Variables globales para acceso de renderizado
//--------------------------------------------------------------
const server = fgDigitalConfig.server_rtc;
//https://rtc01.multicommerce.online:8089/janus
//const server = "wss://rtc01.multicommerce.online:8989/janus";

let janusVR = null;
let sfutest = null;
let opaqueId = "videoroomtest-"+Janus.randomString(12); //No que es esto

let myroom = 8888;	// identificacion del room
let myNameRoom = "Sala Kratos";

if(getQueryStringValue("room") !== "")
	myroom = parseInt(getQueryStringValue("room"));
let myusername = null;
let myidVR = null;
let mystream = null;
// We use this other ID just to map our subscriptions to us
let mypvtid = null;

let feeds = [];

let idDeviceInputAudio = null;
let idDeviceOutputAudio = null;
let idDeviceInputVideo = null;
let idDeviceInputAudioTmp = null;
let idDeviceOutputAudioTmp = null;
let idDeviceInputVideoTmp = null;

let enableAudioTmp = true;
let enableVideoTmp = true;
let userVisibleTmp = true;

let deviceInputAudio = [];
let deviceInputVideo = [];
let deviceOutputAudio = [];

//----------------------------------------
// Variables para resolucion de pantalla
//----------------------------------------
let videoWidthMin = 64;
let videoWidthIdeal = 100;
let videoWidthMax = 252;
let videoHeightMin = 50;
let videoHeightIdeal = 80;
let videoHeightMax = 140;

//------------------------------------------------
// Janus Gateway: Variables globales para sharing
//------------------------------------------------
let janusShr = null;
let screentest = null;
let myidSH = null;

let capture = null;
let role = null;
let room = null;
let source = null;

let firstTime = true;
let isPublisher = false;

let globalSharingJsep = null;
let idPublisher = null;
let thisUserSharing = false;

let isMobile = false;

const doSimulcast = (getQueryStringValue("simulcast") === "yes" || getQueryStringValue("simulcast") === "true");
const doSimulcast2 = (getQueryStringValue("simulcast2") === "yes" || getQueryStringValue("simulcast2") === "true");
const subscriber_mode = (getQueryStringValue("subscriber-mode") === "yes" || getQueryStringValue("subscriber-mode") === "true");

function getQueryStringValue(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  /* eslint-disable-next-line no-restricted-globals */
  results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function VideoRoomTest() {
  const [error, setError] = useState(false);
  const [janusReady, setJanusReady] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const [nameUserJoin, setNameUserJoin] = useState("");
  const [nameUserJoinRemoto1, setNameUserJoinRemoto1] = useState("");
  const [nameUserJoinRemoto2, setNameUserJoinRemoto2] = useState("");
  const [nameUserJoinRemoto3, setNameUserJoinRemoto3] = useState("");
  const [nameUserJoinRemoto4, setNameUserJoinRemoto4] = useState("");
  const [nameUserJoinRemoto5, setNameUserJoinRemoto5] = useState("");
  
  const [viewSelectDevice, setViewSelectDevice] = useState(false);
  const [viewJoinRoom, setViewJoinRoom] = useState(false);
  const [viewVideos, setViewVideos] = useState(false);
  const [viewVideoRejected, setViewVideoRejected] = useState(false);
  const [viewNoWebcam, setViewNoWebcam] = useState(false);
  const [toggleAudio, setToggleAudio] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(true);

  const [pluginVRReady, setPluginVRReady] = useState(false);
  const [pluginSHReady, setPluginSHReady] = useState(false);
  const [userJoinedRoom, setUserJoinedRoom] = useState(false);
  const [userVisible, setUserVisible] = useState(true);

  
  const [viewRemoto1, setViewRemoto1] = useState(false);
  const [viewRemoto2, setViewRemoto2] = useState(false);
  const [viewRemoto3, setViewRemoto3] = useState(false);
  const [viewRemoto4, setViewRemoto4] = useState(false);
  const [viewRemoto5, setViewRemoto5] = useState(false);

  const [messageNoViewVideo, setMessageNoViewVideo] = useState('No message');

  const [viewRemoteVideo1, setViewRemoteVideo1] = useState(true);
  const [viewRemoteVideo2, setViewRemoteVideo2] = useState(true);
  const [viewRemoteVideo3, setViewRemoteVideo3] = useState(true);
  const [viewRemoteVideo4, setViewRemoteVideo4] = useState(true);
  const [viewRemoteVideo5, setViewRemoteVideo5] = useState(true);

  const refStreamLocal = useRef(null);
  const refStreamRemoto1 = useRef(null);
  const refStreamRemoto2 = useRef(null);
  const refStreamRemoto3 = useRef(null);
  const refStreamRemoto4 = useRef(null);
  const refStreamRemoto5 = useRef(null);

  const [streamLocal, setStreamLocal] = useState(false);


  //------------------------------
  //Esto es para sharing
  //------------------------------
  const [userSharing, setUserSharing] = useState(false);
  const [userReciveSharing, setUserReciveSharing] = useState(false);
  const refStream = useRef(null);


  useEffect(() => {
    //-----------------------------------------------------------------------------
    // Si inicia Janus, la función handleCallback indicara cuando todos este listo
    //-----------------------------------------------------------------------------
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const isMobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );

    Janus.init({
      debug: true,
      dependencies: Janus.useDefaultDependencies(),
      callback: handleCallback
    });
    return () => { // Desmontado del efecto
      if (janusVR){
        janusVR.destroy();
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
	  var register = {
			request: "join",
      room: myroom,
			ptype: "publisher",
      display: username,
      data: true
		};
		myusername = username;
    sfutest.send({ message: register });
  }

  function publishOwnFeed() {


    // Publish our stream
    //setViewPublish(false);
    //media: {audioRecv: false, videoRecv: false, audioSend: withAudio, videoSend: true,
    let configVideo = null;
    if (Janus.webRTCAdapter.browserDetails.browser === "firefox"){
      configVideo = true;
    }else{
      configVideo = {
        width: { min: videoWidthMin, ideal: videoWidthIdeal, max: videoWidthMax },
        height: { min: videoHeightMin, ideal: videoHeightIdeal, max: videoHeightMax }  
      };
    }
    sfutest.createOffer(
      {
			  media: {video: configVideo, data: true},	// Let's negotiate data channels as well
        simulcast: doSimulcast,
        simulcast2: doSimulcast2,
        success: function(jsep) {
          Janus.debug("Got publisher SDP!", jsep);
          var publish = { request: "configure", audio: true, video: userVisibleTmp }; //userVisibleTmp es por si el usuario quiere o no ser invisible al entrar
          sfutest.send({ message: publish, jsep: jsep });
          //---------------------------------------------------------------------
          // Lo siguiente es para volver a poner el audio y el video como estaban
          //---------------------------------------------------------------------
          if (!enableAudioTmp){
            sfutest.muteAudio();  
          }
          if (!enableVideoTmp){
            sfutest.muteVideo();  
          }
          doChangeDevice(idDeviceInputAudioTmp, idDeviceInputVideoTmp, idDeviceOutputAudioTmp);
          setUserVisible(userVisibleTmp);
        },
        error: function(error) {
          Janus.error("WebRTC error:", error);
          //if(withAudio) {
          //   publishOwnFeed(false,valueAudioIn, valueVideoIn, valueAudioOut);  //Trata de establecer sin audio
             //changeDeviceOutput(valueAudioOut);
          //} else {
            alert("WebRTC error... " + error.message);
            //setViewPublish(true);
          //}
        }
      });
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
      sfutest.data({
        text: mensaje,
        error: handleSendMessageError,
        success: function() {  },
      });  
    }
  }
  
  function unpublishOwnFeed() {
    //setViewPublish(true);
    // Unpublish our stream
    console.log(sfutest);
    
    var unpublish = { request: "unpublish" };
    sfutest.send({ message: unpublish });
    setUserVisible(false);
  }

  function habilitarRemoto(index,value){
    if (index === 1){
      setViewRemoto1(value);
    }
    if (index === 2){
      setViewRemoto2(value);
    }
    if (index === 3){
      setViewRemoto3(value);
    }
    if (index === 4){
      setViewRemoto4(value);
    }
    if (index === 5){
      setViewRemoto5(value);
    }
  }

  function habilitarNoRemotoVideo(index,value,messageView){
    if (!value){
      setMessageNoViewVideo(messageView);
    }
    if (index === 1){
      setViewRemoteVideo1(!value);
    }
    if (index === 2){
      setViewRemoteVideo2(!value);
    }
    if (index === 3){
      setViewRemoteVideo3(!value);
    }
    if (index === 4){
      setViewRemoteVideo4(!value);
    }
    if (index === 5){
      setViewRemoteVideo5(!value);
    }
  }

  async function attachMediaStreamRemoto(index, stream, nameUser){
    if (index === 1){
      refStreamRemoto1.current.srcObject = stream;
      setNameUserJoinRemoto1(nameUser);
    }  
    if (index === 2){
      refStreamRemoto2.current.srcObject = stream;
      setNameUserJoinRemoto2(nameUser);
    }
    if (index === 3){
      refStreamRemoto3.current.srcObject = stream;
      setNameUserJoinRemoto3(nameUser);
    }
    if (index === 4){
      refStreamRemoto4.current.srcObject = stream;
      setNameUserJoinRemoto4(nameUser);
    }
    if (index === 5){
      refStreamRemoto5.current.srcObject = stream;
      setNameUserJoinRemoto5(nameUser);
    }
    //---------------------------------------------------------------
    // Lo siguiente es si el usuario camio esto antes de inciar todo
    //---------------------------------------------------------------
    setAudioOutput (index, idDeviceOutputAudioTmp)
  }

  function isNullMediaStreamRemoto(index){
    if (index === 1){
      if (refStreamRemoto1.current.srcObject === null){
        return true;
      }
    }  
    if (index === 2){
      if (refStreamRemoto2.current.srcObject === null){
        return true;
      }
    }
    if (index === 3){
      if (refStreamRemoto3.current.srcObject === null){
        return true;
      }
    }
    if (index === 4){
      if (refStreamRemoto4.current.srcObject === null){
        return true;
      }
    }
    if (index === 5){
      if (refStreamRemoto5.current.srcObject === null){
        return true;
      }
    }
    return false;
  }

  function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
  }

  function newRemoteFeedVR(id, display, audio, video) {
    // A new feed has been published, create a new plugin handle and attach to it as a subscriber
    let remoteFeedVR = null;
    janusVR.attach(
      {
        plugin: "janus.plugin.videoroom",
        opaqueId: opaqueId,
        success: function(pluginHandle) {
          remoteFeedVR = pluginHandle;
          Janus.log("Plugin attached! (" + remoteFeedVR.getPlugin() + ", id=" + remoteFeedVR.getId() + ")");
          Janus.log("  -- This is a subscriber");
          // We wait for the plugin to send us an offer
          var subscribe = {
            request: "join",
            room: myroom,
            ptype: "subscriber",
            feed: id,
            private_id: mypvtid,
            data: true
          };
          if(Janus.webRTCAdapter.browserDetails.browser === "safari" &&
              (video === "vp9" || (video === "vp8" && !Janus.safariVp8))) {
            if(video)
              video = video.toUpperCase()
            alert("Publisher is using " + video + ", but Safari doesn't support it: disabling video");
            subscribe["offer_video"] = false;
          }
          remoteFeedVR.videoCodec = video;
          remoteFeedVR.send({ message: subscribe });
        },
        error: function(error) {
          Janus.error("  -- Error attaching plugin...", error);
          alert("Error attaching plugin... " + error);
        },
        onmessage: function(msg, jsep) {
          Janus.debug(" ::: Got a message (subscriber) :::", msg);
          const event = msg["videoroom"];
          Janus.debug("Event: " + event);
          if(msg["error"]) {
            alert("Alert 1 " + msg["error"]);
            consoloe.log(msg);
            console.log(jsep);
          } else if(event) {
            if(event === "attached") {
              // Subscriber created and attached
              for(let i=1;i<6;i++) {
                if(!feeds[i]) {
                  feeds[i] = remoteFeedVR;
                  remoteFeedVR.rfindex = i;
                  break;
                }
              }
              remoteFeedVR.rfid = msg["id"];
              remoteFeedVR.rfdisplay = msg["display"];
              // Aqui se puede iniciar la animación
              Janus.log("Successfully attached to feed " + remoteFeedVR.rfid + " (" + remoteFeedVR.rfdisplay + ") in room " + msg["room"]);
              habilitarRemoto(remoteFeedVR.rfindex,true);
            } else if(event === "event") {
              // Check if we got a simulcast-related event from this publisher
              const substream = msg["substream"];
              const temporal = msg["temporal"];
              if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                //Aqui se controla el simulcast, pero nosotros no lo usaremos 
              }
            } else {
              // What has just happened? // Que ha ocurrido
            }
          }
          if(jsep) {
            Janus.debug("Handling SDP as well...", jsep);
            // Answer and attach
            remoteFeedVR.createAnswer(
              {
                jsep: jsep,
                // Add data:true here if you want to subscribe to datachannels as well
                // (obviously only works if the publisher offered them in the first place)
                media: { audioSend: false, videoSend: false, data: true},	// We want recvonly audio/video
                success: function(jsep) {
                  Janus.debug("Got SDP!", jsep);
                  var body = { request: "start", room: myroom };
                  remoteFeedVR.send({ message: body, jsep: jsep });
                },
                error: function(error) {
                  Janus.error("WebRTC error:", error);
                  alert("WebRTC error... " + error.message);
                }
              });
          }
        },
        iceState: function(state) {
          Janus.log("ICE state of this WebRTC PeerConnection (feed #" + remoteFeedVR.rfindex + ") changed to " + state);
        },
        webrtcState: function(on) {
          Janus.log("Janus says this WebRTC PeerConnection (feed #" + remoteFeedVR.rfindex + ") is " + (on ? "up" : "down") + " now");
        },
        onlocalstream: function(stream) {
          // The subscriber stream is recvonly, we don't expect anything here
        },
        onremotestream: function(stream) {
          //console.log("Esto tengo al REMOTO");
          //console.log(remoteFeedVR);
          Janus.debug("Remote feed #" + remoteFeedVR.rfindex + ", stream:", stream);
          let addButtons = false;
    
          if(isNullMediaStreamRemoto(remoteFeedVR.rfindex)) {
              addButtons = true;
          }

          habilitarNoRemotoVideo(remoteFeedVR.rfindex,false,'');
          attachMediaStreamRemoto(remoteFeedVR.rfindex, stream, remoteFeedVR.rfdisplay);
          //----------------------------------------------------------------------------------------
          // Si estoy compartiendo pantalla, les envio la señal para que ser una a la presentación
          //----------------------------------------------------------------------------------------
          if (thisUserSharing){
            sendMessage('@@IDSHR@@' + room);
          }
          //setAudioOutput(remoteFeed.rfindex, idDeviceOutputAudio);
          
          const videoTracks = stream.getVideoTracks();
          if(!videoTracks || videoTracks.length === 0) {
            // No remote video
            habilitarNoRemotoVideo(remoteFeedVR.rfindex,true,'No puedo nostrar video 1');
            attachMediaStreamRemoto(remoteFeedVR.rfindex, null, '');            
          } else {
            //alert("listo se muestra el video");
            //habilitarNoRemotoVideo(remoteFeedVR.rfindex,false,' '); 
          }
          if(!addButtons)
            return;
          if(Janus.webRTCAdapter.browserDetails.browser === "chrome" || Janus.webRTCAdapter.browserDetails.browser === "firefox" ||
              Janus.webRTCAdapter.browserDetails.browser === "safari") {
              // Aqui se puede sacar las dimenciones del video reciido
              //const curres = getDimensionStream(remoteFeedVR.rfindex);
          }
        },
        ondata: function(data) {
          // aqui poner el setState para mandar el mensaje
          Janus.debug("We got data from the DataChannel! " + data);
          let posHastack = data.indexOf('@@IDSHR@@');
          let data2 = data;
          if (posHastack >= 0){
            data2 = data.substr(posHastack + 9);
            room = data2;
            joinScreen(room);
          }else{
            alert("algo paso :" + data);
            //setDataRecive(data2);
          }   
        },
        oncleanup: function() {
          Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
          //Aqui se puede parar la animación
          habilitarNoRemotoVideo(remoteFeedVR.rfindex,true,'No puedo nostrar video 2');
          attachMediaStreamRemoto(remoteFeedVR.rfindex, null, '');
          // Aqui hay que limpiar todo.
        }
      });
  }
  
//--------------------------------------------------------------------
// Función que permite obtener un arreglo de los devices del equipo
//--------------------------------------------------------------------
function initDevices(devices) {
  deviceInputAudio = [];
  deviceInputVideo = [];
  deviceOutputAudio = [];
	devices.forEach(function(device) {
		var label = device.label;
		if(!label || label === "")
			label = device.deviceId;
		if(device.kind === 'audioinput') {
      deviceInputAudio.push({id: device.deviceId, viewValue: label});
		} else if(device.kind === 'videoinput') {
      deviceInputVideo.push({id: device.deviceId, viewValue: label});
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

  idDeviceInputAudio = deviceInputAudio[0].id;
  idDeviceOutputAudio = deviceOutputAudio[0].id;
  idDeviceInputVideo = deviceInputVideo[0].id;

  idDeviceInputAudioTmp = deviceInputAudio[0].id;
  idDeviceOutputAudioTmp = deviceOutputAudio[0].id;
  idDeviceInputVideoTmp = deviceInputVideo[0].id;

  setViewSelectDevice(true);
}

  //--------------------------------------------------------------------
  // Función que permite crear el objeto Janus e iniciar la transmisión
  //--------------------------------------------------------------------
  async function dejarTodoListo(){
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
    if (pluginVRReady) { 
      //setBitrate(bitrateOptions[0].id);
      if (streamLocal){
        unpublishOwnFeed();
      }
      setPluginVRReady(false);
      setUserJoinedRoom(false);
      setStreamLocal(false);
      for(let i=1;i<6;i++) {
        habilitarRemoto(i,false);
        habilitarNoRemotoVideo(i,false,' ');
        attachMediaStreamRemoto(i, null, '');
      }
      setViewVideos(false);
      setViewJoinRoom(false);
      setUserVisible(true);
      janusVR.destroy();

      idDeviceInputAudio = null;
      idDeviceOutputAudio = null;
      idDeviceInputVideo = null;
      idDeviceInputAudioTmp = null;
      idDeviceOutputAudioTmp = null;
      idDeviceInputVideoTmp = null;

      setToggleVideo(true);
      setToggleAudio(true);
      enableAudioTmp = true;
      enableVideoTmp = true;
      userVisibleTmp = true;

      deviceInputAudio = [];
      deviceInputVideo = [];
      deviceOutputAudio = [];

      //---------------
      // por sharing
      //---------------
      refStream.current.srcObject = null;
      setUserSharing(false);
      //setSharingReady(false);
      setPluginSHReady(false);
      firstTime = false;
      thisUserSharing = false;
      janusShr.destroy();
      return;
    }
    
    //-----------------------------------------------------------------
    // Creamos el objeto Janus que nos permitirá crear los componentes
    //-----------------------------------------------------------------
    janusVR = new Janus(
      {
        server: server,
        iceServers: [ {urls: "stun:stun.l.google.com:19302"}],
        success: function() {
						// Attach to VideoRoom plugin
						janusVR.attach(
							{
								plugin: "janus.plugin.videoroom",
								opaqueId: opaqueId,
								success: function(pluginHandle) {
									sfutest = pluginHandle;
									Janus.log("Plugin attached! (" + sfutest.getPlugin() + ", id=" + sfutest.getId() + ")");
                  Janus.log("  -- This is a publisher/manager");
                  // Enumerate devices: that's what we're here for
									Janus.listDevices(initDevices);
									
                  // Prepare the username registration
                  setViewJoinRoom(true);
								},
								error: function(error) {
                  console.error(' -- Error attaching plugin...', error);
                  setMensajeError('Error attaching plugin... ' + error);
                  setError(true);
								},
								consentDialog: function(on) {
                  Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
                  if(on) {
                    //Aqui se muestra el efecto de la flecha que ayuda a que el usuario autorice el uso de audio y vodeo
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
									if(!on)
                    return;
                  //Aqui se puede poder codigo para mostrar objetos cuando ya se inicio
                  //El video  
								},
								onmessage: async function(msg, jsep) {
									Janus.debug(" ::: Got a message (publisher) :::", msg);
									const event = msg["videoroom"];
									Janus.debug("Event: " + event);
									if(event) {
										if(event === "joined") {
											// Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
											myidVR = msg["id"];
											mypvtid = msg["private_id"];
											Janus.log("Successfully joined room " + msg["room"] + " with ID " + myidVR);
											if(subscriber_mode) {
                        setViewJoinRoom(false);
                        setViewVideos(true);
											} else {
                        publishOwnFeed();
                        //changeDeviceOutput(idDeviceOutputAudio);
                      }
                      setUserJoinedRoom(true);
											// Any new feed to attach to?
											if(msg["publishers"]) {
												const list = msg["publishers"];
                        Janus.debug("Got a list of available publishers/feeds:", list);
												for(let f in list) {
													const id = list[f]["id"];
													const display = list[f]["display"];
													const audio = list[f]["audio_codec"];
													const video = list[f]["video_codec"];
                          Janus.debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");
                          if (isMobile){
                            //await timeout(1000); //for 8 sec delay
                          } else {
                            //await timeout(1000); //for 3 sec delay
                          }  
                          newRemoteFeedVR(id, display, audio, video);
                          //await timeout(6000); //for 1 sec delay
                        }
											}
										} else if(event === "destroyed") {
											// The room has been destroyed
											Janus.warn("The room has been destroyed!");
                      alert("The room has been destroyed");
												window.location.reload();
										} else if(event === "event") {
                      // Any new feed to attach to?
											if(msg["publishers"]) {
												const list = msg["publishers"];
												Janus.debug("Got a list of available publishers/feeds:", list);
												for(let f in list) {
													const id = list[f]["id"];
													const display = list[f]["display"];
													const audio = list[f]["audio_codec"];
													const video = list[f]["video_codec"];
                          Janus.debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");
                          if (isMobile){
                            //await timeout(1000); //for 6 sec delay
                          } else {
                            //await timeout(1000); //for 3 sec delay
                          }  
                          newRemoteFeedVR(id, display, audio, video);
                          //await timeout(6000); //for 1 sec delay
												}
											} else if(msg["leaving"]) {
												// One of the publishers has gone away?
												const leaving = msg["leaving"];
												Janus.log("Publisher left: " + leaving);
												let remoteFeedVR = null;
												for(let i=1; i<6; i++) {
													if(feeds[i] && feeds[i].rfid === leaving) {
														remoteFeedVR = feeds[i];
														break;
													}
												}
												if(remoteFeedVR !== null) {
                          Janus.debug("Feed " + remoteFeedVR.rfid + " (" + remoteFeedVR.rfdisplay + ") has left the room, detaching");
                          //Hay que dejar de mostrar el video que se fue
                          attachMediaStreamRemoto(remoteFeedVR.rfindex, null, '');
                          habilitarRemoto(remoteFeedVR.rfindex,false);
                          
													feeds[remoteFeedVR.rfindex] = null;
													remoteFeedVR.detach();
												}
											} else if(msg["unpublished"]) {
												// One of the publishers has unpublished?
												const unpublished = msg["unpublished"];
												Janus.log("Publisher left: " + unpublished);
												if(unpublished === 'ok') {
                          // That's us
													sfutest.hangup();
													return;
												}
												let remoteFeedVR = null;
												for(let i=1; i<6; i++) {
													if(feeds[i] && feeds[i].rfid === unpublished) {
														remoteFeedVR = feeds[i];
														break;
													}
												}
												if(remoteFeedVR != null) {
                          Janus.debug("Feed " + remoteFeedVR.rfid + " (" + remoteFeedVR.rfdisplay + ") has left the room, detaching");
                          //Hay que dejar de mostrar el video del que ha escondido el video
                          attachMediaStreamRemoto(remoteFeedVR.rfindex, null, '');
                          habilitarRemoto(remoteFeedVR.rfindex,false);

													feeds[remoteFeedVR.rfindex] = null;
													remoteFeedVR.detach();
												}
											} else if(msg["error"]) {
												if(msg["error_code"] === 426) {
													// This is a "no such room" error: give a more meaningful description
													alert("Problemas encontrado la sala de reunión, por favor vuelva a intentarlo");
												} else {
													alert("Alert 2 " + msg["error"]);
												}
											}
										}
                  }
									if(jsep) {
										Janus.debug("Handling SDP as well...", jsep);
										sfutest.handleRemoteJsep({ jsep: jsep });
										// Check if any of the media we wanted to publish has
										// been rejected (e.g., wrong or unsupported codec)
										const audio = msg["audio_codec"];
										if(mystream && mystream.getAudioTracks() && mystream.getAudioTracks().length > 0 && !audio) {
											// Audio has been rejected
											alert("Our audio stream has been rejected, viewers won't hear us");
										}
										const video = msg["video_codec"];
										if(mystream && mystream.getVideoTracks() && mystream.getVideoTracks().length > 0 && !video) {
											// Video has been rejected
											alert("Our video stream has been rejected, viewers won't see us");
                      // Hide the webcam video
                      setViewVideoRejected(true);
										}
                  }
								},
								onlocalstream: function(stream) {
									Janus.debug(" ::: Got a local stream :::", stream);
                  mystream = stream;
                  
                  setViewJoinRoom(false);
                  setViewVideos(true);
                  //Esto hay que implememtar
                  //clickUnPublished();
									//$('#unpublish').click(unpublishOwnFeed);
                  //$('#publisher').removeClass('hide').html(myusername).show();
                  setNameUserJoin(myusername);
                  setStreamLocal(true);
                  refStreamLocal.current.srcObject = stream;
                  //----------------------------------------------------------
                  // Lo siguiente es si el usuario puso en mute audio o video
                  //----------------------------------------------------------
                  if (!enableAudioTmp){
                    sfutest.muteAudio();  
                  }
                  if (!enableVideoTmp){
                    sfutest.muteVideo();  
                  }

                  //Janus.attachMediaStream($('#myvideo').get(0), stream);
									if(sfutest.webrtcStuff.pc.iceConnectionState !== "completed" &&
											sfutest.webrtcStuff.pc.iceConnectionState !== "connected") {

                    //Aqui hay que nostrar el efecgto de wait hasta que salga el vide

									}
									const videoTracks = stream.getVideoTracks();
									if(!videoTracks || videoTracks.length === 0) {
                    // No webcam
                    setViewNoWebcam(true);
									} else {
                    setViewNoWebcam(false);
									}
								},
								onremotestream: function(stream) {
                  // The publisher stream is sendonly, we don't expect anything here
                  // La transmisión del editor es de solo envío, no esperamos nada aquí
								},
								oncleanup: function() {
									Janus.log(" ::: Got a cleanup notification: we are unpublished now :::");
                  mystream = null;
                  refStreamLocal.current.srcObject = null;
                  //if (isUserAction){
                  //  isUserAction = false;
                    //setViewPublish(true);
                  //} else {
                  //  clickPublished();
                  //}
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

      await timeout(1000); //para dar tiempo a que se llene el arreglo de device in/out
      setPluginVRReady(true);

    //------------------------------------------------------------------------------
    // Creamos el objeto Janus que nos permitirá crear los componentes de SHARING
    //------------------------------------------------------------------------------
    // Create session
    janusShr = new Janus(
      {
        server: server,
        success: function () {
          newLocalFeed();
        },
        error: function (error) {
          Janus.error(error);
          //bootbox.alert(error, function() {
          //	window.location.reload();
          //});
          setMensajeError("Error 2:" + error);
          setError(true);
        },
        destroyed: function () {
          //window.location.reload();
        }
      });

    setPluginSHReady(true);
  }

  function newLocalFeed(){
    // Attach to VideoRoom plugin
    janusShr.attach(
      {
        plugin: "janus.plugin.videoroom",
        opaqueId: opaqueId,
        success: function (pluginHandle) {
          //$('#details').remove();
          screentest = pluginHandle;
          Janus.log("Plugin attached! (" + screentest.getPlugin() + ", id=" + screentest.getId() + ")");
          // Prepare the username registration
          //$('#screenmenu').removeClass('hide').show();
          //$('#createnow').removeClass('hide').show();
          //$('#create').click(preShareScreen);
          //$('#joinnow').removeClass('hide').show();
          //$('#join').click(joinScreen);
          //$('#desc').focus();
          //$('#start').removeAttr('disabled').html("Stop")
          //	.click(function() {
          //		$(this).attr('disabled', true);
          //		janus.destroy();
          //	});
        },
        error: function (error) {
          Janus.error("  -- Error attaching plugin...", error);
          setMensajeError('Error attaching plugin... ' + error);
          setError(true);
        },
        consentDialog: function (on) {
          Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
          if (on) {
            //Aqui se muestra el efecto de la fecha que ayuda a que el usuario autorice el uso de audio y vodeo
          } else {
            //Se quita el bloqueo de la pantalla
          }
        },
        webrtcState: function (on) {
          Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
          //$("#screencapture").parent().unblock();
          //refStream.current.parent().unblock();
          if (on) {
            sendMessage('@@IDSHR@@' + room);
            //alert("ID <b>" + room + "</b> session identifier");
          } else {
            alert("Your screen sharing session just stopped.");
            resetSharing();
            //janusShr.destroy();
            //window.location.reload();
          }
        },
        onmessage: function (msg, jsep) {
          Janus.debug(" ::: Got a message (publisher) :::");
          Janus.debug(msg);
          var event = msg["videoroom"];
          Janus.debug("Event 2: " + event);
          if (event != undefined && event != null) {
            if (event === "joined") {
              //alert("Fue añadido");
              myidSH = msg["id"];
              idPublisher = msg["id"];
              //$('#session').html(room);
              //setIdSession(room);
              //$('#title').html(msg["description"]);
              //setScreenTitle(msg["description"]);
              Janus.log("Successfully joined room " + msg["room"] + " with ID " + myidSH);
              if (role === "publisher") {
                // This is our session, publish our stream
                Janus.debug("Negotiating WebRTC stream for our screen (capture " + capture + ")");
                screentest.createOffer(
                  {
                    media: { video: capture, audioSend: false, videoRecv: false },	// Screen sharing Publishers are sendonly
                    success: function (jsep) {
                      globalSharingJsep = jsep;
                      Janus.debug("Got publisher SDP!");
                      Janus.debug(jsep);
                      //var publish = { "request": "configure", "audio": false, "video": true };
                      console.log("voy a hacerlo como publish nada mas");
                      var publish = { "request": "publish", "audio": false, "video": true };
                      screentest.send({ "message": publish, "jsep": jsep });
                    },
                    error: function (error) {
                      Janus.error("WebRTC error:", error);
                      //bootbox.alert("WebRTC error... " + JSON.stringify(error));
                      setMensajeError("WebRTC error... " + JSON.stringify(error));
                      setError(true);
                    }
                  });
              } else {
                //alert("no soy publicador");
                // We're just watching a session, any feed to attach to?
                if (msg["publishers"] !== undefined && msg["publishers"] !== null) {
                  var list = msg["publishers"];
                  Janus.debug("Got a list of available publishers/feeds:");
                  Janus.debug(list);
                  for (var f in list) {
                    var id = list[f]["id"];
                    //idPublisher = id;
                    //alert("este es el id " + id);
                    var display = list[f]["display"];
                    Janus.debug("  >> [" + id + "] " + display);
                    newRemoteFeed(id, display)
                  }
                }
              }
            } else if (event === "event") {
              // Any feed to attach to?
              if (role === "listener" && msg["publishers"] !== undefined && msg["publishers"] !== null) {
                var list = msg["publishers"];
                Janus.debug("Got a list of available publishers/feeds:");
                Janus.debug(list);
                for (var f in list) {
                  var id = list[f]["id"];
                  var display = list[f]["display"];
                  Janus.debug("  >> [" + id + "] " + display);
                  newRemoteFeed(id, display)
                }
              } else if (msg["leaving"] !== undefined && msg["leaving"] !== null) {
                // One of the publishers has gone away?
                var leaving = msg["leaving"];
                Janus.log("Publisher left: " + leaving);
                if (role === "listener" && msg["leaving"] === source) {
                  alert("The screen sharing session is over, the publisher left");
                  resetSharing();
                  //window.location.reload();
                }
              } else if (msg["unpublished"] !== undefined && msg["unpublished"] !== null) {
                resetSharing();
                //setUserReciveSharing(false);
              } else if (msg["error"] !== undefined && msg["error"] !== null) {
                // Este es un bug por que igual funciona, lo que pasa es que el uppublished no es inmediato
                //setMensajeError("Error 1: role=> " + role + " publishers=> " + msg["publishers"] + " " + msg["error"]);
                //setError(true);
              }
            }
          }
          if (jsep !== undefined && jsep !== null) {
            Janus.debug("Handling SDP as well...");
            Janus.debug(jsep);
            screentest.handleRemoteJsep({ jsep: jsep });
          }
        },
        onlocalstream: function (stream) {
          Janus.debug(" ::: Got a local stream :::");
          Janus.debug(stream);
          //$('#screenmenu').hide();
          //$('#room').removeClass('hide').show();
          //if($('#screenvideo').length === 0) {
          //	$('#screencapture').append('<video class="rounded centered" id="screenvideo" width="100%" height="100%" autoplay playsinline muted="muted"/>');
          //}
          //Janus.attachMediaStream($('#screenvideo').get(0), stream);
          console.log('Listo para iniciar le video local, pero no se iniciará');
          //refStream.current.srcObject = stream;
          setUserSharing(true);
          thisUserSharing = true;
          //setSharingReady(true);

          if (screentest.webrtcStuff.pc.iceConnectionState !== "completed" &&
            screentest.webrtcStuff.pc.iceConnectionState !== "connected") {
            //$("#screencapture").parent().block({
            /*  refStream.current.parent().block({
              message: '<b>Publishing...</b>',
              css: {
                border: 'none',
                backgroundColor: 'transparent',
                color: 'white'
              }
            });*/
          }
        },
        onremotestream: function (stream) {
          // The publisher stream is sendonly, we don't expect anything here
        },
        oncleanup: function () {
          Janus.log(" ::: Got a cleanup notification :::");
          //$('#screencapture').empty();
          //$("#screencapture").parent().unblock();
          //refStream.current.empty();
          //refStream.current.parent().unblock();

          //$('#room').hide();
          setUserSharing(false);
          //setSharingReady(false);
        }
      });
  }


  //----------------------------------------
  // Funciones utilizadas en elementos html
  //----------------------------------------
  function clickUserVisibility(){
    const newVal = !userVisible;
    userVisibleTmp = newVal;
    if (!streamLocal){
      setUserVisible(newVal);
    }else{
      if (!newVal){
        unpublishOwnFeed();
      }else{
        publishOwnFeed();
      }  
    }
  }

  function clickToggleAudio(){
    const newVal = !toggleAudio;
    enableAudioTmp = newVal;
    setToggleAudio(newVal);
    if (streamLocal){
      if(newVal){
        sfutest.unmuteAudio();  
      } else {
        sfutest.muteAudio();
      }
    }
    Janus.log((newVal ? "Unmuting Audio" : "Muting Audio") + " local stream...");
  }

  function clickToggleVideo(){
    const newVal = !toggleVideo;
    enableVideoTmp = newVal;
    setToggleVideo(newVal);
    if (streamLocal){
      if(newVal){
        sfutest.unmuteVideo();  
      } else {
        sfutest.muteVideo();
      }
    }
    Janus.log((newVal ? "Unmuting Video" : "Muting Video") + " local stream...");
  }

  function clickChangeDevice(valueAudioIn, valueVideoIn, valueAudioOut){
    idDeviceInputAudioTmp = valueAudioIn;
    idDeviceInputVideoTmp = valueVideoIn;
    idDeviceOutputAudioTmp = valueAudioOut;
    if (streamLocal){
      doChangeDevice(valueAudioIn, valueVideoIn, valueAudioOut);
    }
  }

   function doChangeDevice(valueAudioIn, valueVideoIn, valueAudioOut){
    //alert(idDeviceOutputAudio + "===" + valueAudioOut);
    //alert(idDeviceInputAudio + "===" + valueAudioIn);
    let replaceAudio = idDeviceInputAudio !== valueAudioIn;
    idDeviceInputAudio = valueAudioIn;
	  let replaceVideo = idDeviceInputVideo !== valueVideoIn;
    idDeviceInputVideo = valueVideoIn;
    //alert("adioIn=>" + valueAudioIn + " videoIn=>" + valueVideoIn + "audioOut=>" + valueAudioOut);
    let configVideo = null;
    if (Janus.webRTCAdapter.browserDetails.browser === "firefox"){
      configVideo = {
        deviceId: {
          exact: idDeviceInputVideo
        }};
    } else{
      configVideo = {
        deviceId: {
          exact: idDeviceInputVideo
        }, 
        width: { min: videoWidthMin, ideal: videoWidthIdeal, max: videoWidthMax },
        height: { min: videoHeightMin, ideal: videoHeightIdeal, max: videoHeightMax }  
      };
    }
    sfutest.createOffer(
      {
        // By default, it's sendrecv for audio and video...
        media: {
          audio: {
					  deviceId: {
						  exact: idDeviceInputAudio
					  }
				  },
				  replaceAudio: replaceAudio,	// This is only needed in case of a renegotiation
				  video: configVideo,
				  replaceVideo: replaceVideo,
          data: true },	// ... let's negotiate data channels as well
        // If you want to test simulcasting (Chrome and Firefox only), then
        // pass a ?simulcast=true when opening this demo page: it will turn
        // the following 'simulcast' property to pass to janus.js to true
        simulcast: doSimulcast,
        success: function(jsep) {
          Janus.debug("Got SDP!");
          //Janus.debug(jsep);
          //var body = { "request": "call", "username": userName };
          //videocall.send({"message": body, "jsep": jsep});
        },
        error: function(error) {
          Janus.error("WebRTC error...", error);
          alert("WebRTC error... " + error);
        }
      }); 
      if (streamLocal){
        let replaceAudioOut = idDeviceOutputAudio !== valueAudioOut;
        idDeviceOutputAudio = valueAudioOut;
        if (replaceAudioOut){
          Janus.log('Audio output device attached:', idDeviceOutputAudio);
          changeDeviceOutput(valueAudioOut);
        } 
      }
  }

  function goSetAudioOutput(refStream, valueAudioOut){
    if(typeof refStream.current.setSinkId == 'function'){ ////ocurre en safary y firefox que no existe esta funcion
      refStream.current.setSinkId(valueAudioOut);
    }
    idDeviceOutputAudio = valueAudioOut;
  }
  
  function setAudioOutput (index, valueAudioOut){
    if (index === 1){
      if (refStreamRemoto1.current.srcObject !== null){
        //alert ("voy a cambiar a " + valueAudioOut);
        goSetAudioOutput(refStreamRemoto1, valueAudioOut)
      }
    }  
    if (index === 2){
      if (refStreamRemoto2.current.srcObject !== null){
        goSetAudioOutput(refStreamRemoto2, valueAudioOut)
      }
    }  
    if (index === 3){
      if (refStreamRemoto3.current.srcObject !== null){
        goSetAudioOutput(refStreamRemoto3, valueAudioOut)
      }
    }  
    if (index === 4){
      if (refStreamRemoto4.current.srcObject !== null){
        goSetAudioOutput(refStreamRemoto4, valueAudioOut)
      }
    }  
    if (index === 5){
      if (refStreamRemoto5.current.srcObject !== null){
        goSetAudioOutput(refStreamRemoto5, valueAudioOut)
      }
    }  
    idDeviceOutputAudio = valueAudioOut;
  }


  function changeDeviceOutput(valueAudioOut){
    for(let index=1;index<6;index++) {
      setAudioOutput(index, idDeviceOutputAudio)
    }
  }

    //-----------------------------------------------------
  // Funciones para SHARING
  //-----------------------------------------------------
  function newRemoteFeed(id, display) {
    // A new feed has been published, create a new plugin handle and attach to it as a listener
    source = id;
    let remoteFeed = null;
    janusShr.attach(
      {
        plugin: "janus.plugin.videoroom",
        opaqueId: opaqueId,
        success: function(pluginHandle) {
          remoteFeed = pluginHandle;
          Janus.log("Plugin attached! (" + remoteFeed.getPlugin() + ", id=" + remoteFeed.getId() + ")");
          Janus.log("  -- This is a subscriber");
          // We wait for the plugin to send us an offer
          var listen = { "request": "join", "room": room, "ptype": "listener", "feed": id };
          remoteFeed.send({"message": listen});
        },
        error: function(error) {
          Janus.error("  -- Error attaching plugin...", error);
          //bootbox.alert("Error attaching plugin... " + error);
          setMensajeError("Error attaching plugin... " + error);
          setError(true);
        },
        onmessage: function(msg, jsep) {
          Janus.debug(" ::: Got a message (listener) :::");
          Janus.debug(msg);
          var event = msg["videoroom"];
          Janus.debug("Event 1: " + event);
          if(event != undefined && event != null) {
            if(event === "attached") {
              // Subscriber created and attached
              /*if(spinner === undefined || spinner === null) {
                var target = document.getElementById('#screencapture');
                spinner = new Spinner({top:100}).spin(target);
              } else {
                spinner.spin();
              }*/
              Janus.log("Successfully attached to feed " + id + " (" + display + ") in room " + msg["room"]);
              //$('#screenmenu').hide();
              //$('#room').removeClass('hide').show();
              //setViewRoom(true);
            } else {
              // What has just happened?
            }
          }
          if(jsep !== undefined && jsep !== null) {
            Janus.debug("Handling SDP as well...");
            Janus.debug(jsep);
            // Answer and attach
            //alert("estoy ne respuesta");
            remoteFeed.createAnswer(
              {
                jsep: jsep,
                media: { audioSend: false, videoSend: false },	// We want recvonly audio/video
                success: function(jsep) {
                  Janus.debug("Got SDP!");
                  Janus.debug(jsep);
                  var body = { "request": "start", "room": room };
                  remoteFeed.send({"message": body, "jsep": jsep});
                },
                error: function(error) {
                  Janus.error("WebRTC error:", error);
                  //bootbox.alert("WebRTC error... " + error);
                  setMensajeError("WebRTC error... " + error);
                  setError(true);
                }
              });
          }
        },
        onlocalstream: function(stream) {
          // The subscriber stream is recvonly, we don't expect anything here
        },
        onremotestream: function(stream) {
          //if($('#screenvideo').length === 0) {
            // No remote video yet
            /*$('#screencapture').append('<video class="rounded centered" id="waitingvideo" width="100%" height="100%" />');
            $('#screencapture').append('<video class="rounded centered hide" id="screenvideo" width="100%" height="100%" autoplay playsinline/>');
            // Show the video, hide the spinner and show the resolution when we get a playing event
            $("#screenvideo").bind("playing", function () {
              $('#waitingvideo').remove();
              $('#screenvideo').removeClass('hide');
              if(spinner !== null && spinner !== undefined)
                spinner.stop();
              spinner = null;
            });*/
          //}
          //Janus.attachMediaStream($('#screenvideo').get(0), stream);
          console.log('inicio a mostrar el video 2');
          refStream.current.srcObject = stream;
          //setSharingReady(false);
          setUserReciveSharing(true);
        },
        oncleanup: function() {
          Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
          /*$('#waitingvideo').remove();
          if(spinner !== null && spinner !== undefined)
            spinner.stop();
          spinner = null;*/
        }
      });
  }

  //----------------------------------------
  // Funciones utilizadas en elementos html
  //----------------------------------------
  async function resetSharing() {
    await timeout(2000); //Espera a que todo termine
    setUserSharing(false);
    setUserReciveSharing(false);
    setStreamLocal(false);
    refStream.current.srcObject = null;
    //setJanusSharingReady(false);  
  }

  async function shareScreen(titleShared) {
    if(!Janus.isExtensionEnabled()) {
      alert("You're using Chrome but don't have the screensharing extension installed: click <b><a href='https://chrome.google.com/webstore/detail/janus-webrtc-screensharin/hapfgfdkleiggjjpfpenajgdnfckjpaj' target='_blank'>here</a></b> to do so");
      //, function() {
      //  window.location.reload();
      //});
      return;
    }
    if (typeof window.navigator.mediaDevices.getDisplayMedia === "undefined"){
      alert("Compartir pantalla no es posible en este dispositivo");
      return;
    } 
    /*
    let constraints = {};
    constraints.video = {};
    constraints.audio = false;
    navigator.mediaDevices.getDisplayMedia(constraints)
    .then(function(stream) {
      screentest.consentDialog(false);
      //streamsDone(handleId, jsep, media, callbacks, stream);
    }, function (error) {
      screentest.consentDialog(false);
      //callbacks.error(error);
    });   
    return; 
    */
    capture = "screen";
    role = "publisher";

    if (firstTime){
      // Create a new room
      let desc = titleShared;
      let create = { "request": "create", "description": desc, "bitrate": 500000, "publishers": 1 };
      screentest.send({"message": create, success: function(result) {
        var event = result["videoroom"];
        Janus.debug("Event 3: " + event);
        if(event != undefined && event != null) {
          // Our own screen sharing session has been created, join it
          room = result["room"];
          Janus.log("Screen sharing session created: " + room);
          myusername = Janus.randomString(12);
          //idPublisher = randomString(9);
          var register = { "request": "join", "room": room, "ptype": "publisher", "display": myusername};
          screentest.send({"message": register});
        }
      }});
      firstTime = false;  
    }else {
      screentest.createOffer(
        {
          media: { video: capture, audioSend: false, videoRecv: false },	// Screen sharing Publishers are sendonly
          success: function (jsep) {
            globalSharingJsep = jsep;
            Janus.debug("Got publisher SDP!");
            Janus.debug(jsep);
            //var publish = { "request": "configure", "audio": false, "video": true };
            console.log("voy a hacerlo como publish nada mas");
            var publish = { "request": "publish", "audio": false, "video": true  };
            screentest.send({ "message": publish, "jsep": jsep});
            //sendMessage('@@IDRESHR@@' + idPublisher);
            sendMessage('@@IDSHR@@' + room);
          },
          error: function (error) {
            Janus.error("WebRTC error:", error);
            //bootbox.alert("WebRTC error... " + JSON.stringify(error));
            setMensajeError("WebRTC error... " + JSON.stringify(error));
            setError(true);
          }
        });
    }
  }


  function joinScreen(roomId) {
    firstTime = false;
    room = parseInt(roomId);
    role = "listener";
    let myusernameSR = Janus.randomString(12);
    var register = { "request": "join", "room": room, "ptype": "publisher", "display": myusernameSR };
    screentest.send({"message": register});
  }

  async function clickUnPublish(){   
    var register = { "request": "unpublish"};
    screentest.send({"message": register});
    resetSharing();
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
        <div>
          <Button
            color="secondary"
            disabled={false}
            size="large"
            type="button"
            variant="contained"
            onClick={() => dejarTodoListo()}
          >
            {(!viewJoinRoom && !viewVideos) ? 'Iniciar' : 'Detener'}
          </Button>
        </div>
        <div hidden={!pluginVRReady}>
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
            disabled={!pluginVRReady || userJoinedRoom}
            size="large"
            type="button"
            variant="contained"
            onClick={() => registerUsername(username.value)}
          >
            {"Unirse a la " + myNameRoom}
          </Button>
        </div>  
        <div hidden={!pluginVRReady}>
            <Button
              color="secondary"
              size="large"
              type="button"
              variant="contained"
              onClick={() => clickToggleAudio()}
            >
              {toggleAudio ? 'Mute' : 'UnMute'}
            </Button>
            <Button
              color="secondary" 
              size="large"
              type="button"
              variant="contained"
              onClick={() => clickToggleVideo()}
            >
              {toggleVideo?'Disable video':'Enable video'}
            </Button>
            <Button
              color="secondary"
              disabled={false}
              size="large"
              type="button"
              variant="contained"
              onClick={() => clickUserVisibility()}
            >
              {(userVisible) ? 'Ser Invisible' : 'Ser Visible'}
            </Button>
        </div>
        <div hidden={!pluginVRReady}>
          <TextField
              width="20%"
              name="optionAudioIn"
              id="optionAudioIn"
              label="Microfono"
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
          <div>
            <Button // cambiar
              color="secondary"
              size="large"
              type="button"
              variant="contained"
              onClick={() => clickChangeDevice(optionAudioIn.value, optionVideoIn.value, optionAudioOut.value)}
            >
              Cambiar
            </Button>
          </div>   
        </div>  
      </div>  
      <div id="videos" hidden={!viewVideos}>
        <div id="divVideoLocal">
          <h3>Su nombre: {nameUserJoin}</h3>
          <div hidden={viewVideoRejected}>
            <div hidden={!userVisible}>
              <video id="videoLocal" ref={refStreamLocal} width='80' height='80' autoPlay playsInline muted="muted" />
            </div>
            <div hidden={!viewNoWebcam}>
              <div>
                <h3>No disponible Webcam</h3>
              </div>
            </div>

            <div hidden={!viewVideoRejected}>
              <div>
                <h3>Su video no podra ser mostrado con los demas</h3>
              </div>
            </div>

          </div>
          <div hidden={!viewRemoto1} id="divVideoremonto1">
            <h3>Remoto :{nameUserJoinRemoto1}</h3>
            <div hidden={!viewRemoteVideo1}>
              <video id="videoRemoto1" ref={refStreamRemoto1} width='80' height='80' autoPlay playsInline/>
            </div>
            <div hidden={viewRemoteVideo1}>
                <h3>{messageNoViewVideo}</h3>
            </div>
          </div>
          <div hidden={!viewRemoto2} id="divVideoremonto2">
            <h3>Remoto :{nameUserJoinRemoto2}</h3>
            <div hidden={!viewRemoteVideo2}>
              <video id="videoRemoto2" ref={refStreamRemoto2} width='80' height='80' autoPlay playsInline/>
            </div>
            <div hidden={viewRemoteVideo2}>
                <h3>{messageNoViewVideo}</h3>
            </div>
          </div>
          <div hidden={!viewRemoto3} id="divVideoremonto3">
            <h3>Remoto :{nameUserJoinRemoto3}</h3>
            <div hidden={!viewRemoteVideo3}>
              <video id="videoRemoto3" ref={refStreamRemoto3} width='80' height='80' autoPlay playsInline/>
            </div>
            <div hidden={viewRemoteVideo3}>
                <h3>{messageNoViewVideo}</h3>
            </div>
          </div>
          <div hidden={!viewRemoto4} id="divVideoremonto4">
            <h3>Remoto :{nameUserJoinRemoto4}</h3>
            <div hidden={!viewRemoteVideo4}>
              <video id="videoRemoto4" ref={refStreamRemoto4} width='80' height='80' autoPlay playsInline/>
            </div>
            <div hidden={viewRemoteVideo4}>
                <h3>{messageNoViewVideo}</h3>
            </div>
          </div>
          <div hidden={!viewRemoto5} id="divVideoremonto5">
            <h3>Remoto :{nameUserJoinRemoto5}</h3>
            <div hidden={!viewRemoteVideo5}>
              <video id="videoRemoto5" ref={refStreamRemoto5} width='80' height='80'  autoPlay playsInline/>
            </div>
            <div hidden={viewRemoteVideo5}>
              <h3>{messageNoViewVideo}</h3>
            </div>
          </div>
        </div>
      </div>

      <div id="screenmenu">
     <div hidden={userReciveSharing || userSharing}>
       <Button
       color="secondary"
       disabled={!pluginSHReady}
       size="large"
       type="button"
       variant="contained"
       onClick={() => shareScreen(Janus.randomString(12))}
       > 
       Compartir
       </Button> 
     </div>
     <div hidden={!userSharing || userReciveSharing}>
       <Button
       color="secondary"
       size="large"
       type="button"
       variant="contained"
       onClick={() => clickUnPublish()}
       >
       Dejar de compartir
       </Button>
     </div>
 </div>
 <div id="room" display="false">
   <div>
   </div>
   <div id="screencapture" width="400px" height="300px">
      <video id="screenvideo" ref={refStream} width="400px" height="300px" autoPlay playsInline muted="muted"/>
   </div>
 </div>
    </div>
  );
}

export default VideoRoomTest;