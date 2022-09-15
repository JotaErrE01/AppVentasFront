/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-else-return */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { useState, useEffect, useRef } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Button, TextField, Typography, withStyles, IconButton, Switch, Menu } from '@material-ui/core';
import { fgDigitalConfig } from 'src/config';
import { AirplayRounded, ContactSupportOutlined, MenuRounded, RecordVoiceOver, VoiceOverOffRounded } from '@material-ui/icons';
import styled from 'styled-components';
import JSONTree from 'react-json-tree';
import { ScreenShareRounded, VideocamRounded, VideocamOffRounded, MicRounded, MicOffRounded } from '@material-ui/icons'
import { MEDIA_SCREENS } from 'src/theme/customBreakpoints';
import { palette } from 'src/theme';
import { Star, X } from 'react-feather';
import { isCellExitEditModeKeys } from '@material-ui/data-grid';





//--------------------------------------------------------------
// Janus Gateway: Variables globales para acceso de renderizado
//--------------------------------------------------------------
const server = fgDigitalConfig.server_rtc;


let janusVR = null;
let sfutest = null;

let myroom = 8888;	// identificacion del room
let myNameRoom = "Sala Kratos";

if (getQueryStringValue("room") !== "")
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


const VideoRoomTest = ({
  me,
  remote,
  setRemote,

  habilitarRemoto, attachMediaStreamRemoto, habilitarNoRemotoVideo,

  coreUsers,
  participantsCb,
  participants,

  total
}) => {
  var Janus = window.Janus;

  let opaqueId = "videoroomtest-" + Janus.randomString(12); //No que es esto


  const [error, setError] = useState(false);
  const [janusReady, setJanusReady] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [nameUserJoin, setNameUserJoin] = useState("");
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

  const [messageNoViewVideo, setMessageNoViewVideo] = useState('No message');


  const refStreamLocal = useRef(null);
  const [streamLocal, setStreamLocal] = useState(false);

  //------------------------------
  //Esto es para sharing
  //------------------------------
  const [userSharing, setUserSharing] = useState(false);
  const [userReciveSharing, setUserReciveSharing] = useState(false);
  const refStream = useRef(null);

  //--------------------------------------------------------------------
  async function dejarTodoListo() {
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




    //---------------------------------------------------------------------
    // Si llaman a esta funcióm y existe una stream creado siginifica que
    // se el boton esta en DETENER y se tiene que detener los componentes
    //---------------------------------------------------------------------
    if (pluginVRReady) {
      //setBitrate(bitrateOptions[0].id);
      if (streamLocal) {
        unpublishOwnFeed();
      }
      setPluginVRReady(false);
      setUserJoinedRoom(false);
      setStreamLocal(false);
      for (let i = 1; i < total; i++) {


        //        setRemote([...remote]);


        const falsyRemoteFeedVR = {
          rfindex: i,
          rfdisplay: false
        }


        habilitarRemoto({
          falsyRemoteFeedVR,
          value: false,
          coreUsers,
          current: remote
        });



        attachMediaStreamRemoto({
          remoteFeedVR: falsyRemoteFeedVR,
          stream: null,
          coreUsers,
          current: remote
        });

        habilitarNoRemotoVideo({
          remoteFeedVR: falsyRemoteFeedVR,
          value: false,
          cb: null
        });

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
        iceServers: [{ urls: "stun:stun.l.google.com:19902" }],
        success: function () {
          // Attach to VideoRoom plugin
          janusVR.attach(
            {
              plugin: "janus.plugin.videoroom",
              opaqueId: opaqueId,
              success: function (pluginHandle) {
                sfutest = pluginHandle;
                Janus.listDevices(initDevices);
                console.table({
                  PLUGIN_VR: pluginHandle.getPlugin(),
                  ID: pluginHandle.getId(),
                });

                setViewJoinRoom(true);
              },
              error: function (error) {
                console.error(' -- Error attaching plugin...', error);
                setMensajeError('Error attaching plugin... ' + error);
                setError(true);
              },
              consentDialog: function (on) {
                Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
                if (on) {
                  //Aqui se muestra el efecto de la flecha que ayuda a que el usuario autorice el uso de audio y vodeo
                } else {
                  //Se quita el bloqueo de la pantalla
                }
              },
              iceState: async function (state) {
                Janus.log("ICE state changed to " + state);
                if (state === "connected") {
                  console.error('obteniendo participantes')

                  sfutest.send({
                    message: {
                      "request": "listparticipants",
                      "room": myroom,
                    },
                    success: participantsCb
                  });


                  setViewModal(99);
                }
              },
              mediaState: function (medium, on) {
                Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
              },
              webrtcState: function (on) {
                Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                if (!on)

                  return;
                //Aqui se puede poder codigo para mostrar objetos cuando ya se inicio
                //El video  
              },
              onmessage: async function (msg, jsep) {


                Janus.debug(" ::: Got a message (publisher) :::", msg);
                const event = msg["videoroom"];
                Janus.debug("Event: " + event);
                if (event) {
                  if (event === "joined") {
                    // Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
                    myidVR = msg["id"];
                    mypvtid = msg["private_id"];
                    Janus.log("Successfully joined room " + msg["room"] + " with ID " + myidVR);
                    if (subscriber_mode) {
                      setViewJoinRoom(false);
                      setViewVideos(true);
                    } else {
                      publishOwnFeed();
                      //changeDeviceOutput(idDeviceOutputAudio);
                    }
                    setUserJoinedRoom(true);
                    // Any new feed to attach to?
                    if (msg["publishers"]) {
                      const list = msg["publishers"];
                      Janus.debug("Got a list of available publishers/feeds:", list);
                      for (let f in list) {
                        const id = list[f]["id"];
                        const display = list[f]["display"];
                        const audio = list[f]["audio_codec"];
                        const video = list[f]["video_codec"];
                        Janus.debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");
                        if (isMobile) {
                          //await timeout(1000); //for 8 sec delay
                        } else {
                          //await timeout(1000); //for 3 sec delay
                        }
                        newRemoteFeedVR(id, display, audio, video);
                        //await timeout(6000); //for 1 sec delay
                      }
                    }
                  } else if (event === "destroyed") {
                    // The room has been destroyed
                    Janus.warn("The room has been destroyed!");
                    alert("The room has been destroyed");
                    window.location.reload();
                  } else if (event === "event") {
                    // Any new feed to attach to?
                    if (msg["publishers"]) {
                      const list = msg["publishers"];

                      console.error(list)
                      Janus.debug("Got a list of available publishers/feeds:", list);
                      for (let f in list) {
                        const id = list[f]["id"];
                        const display = list[f]["display"];
                        const audio = list[f]["audio_codec"];
                        const video = list[f]["video_codec"];
                        Janus.debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");
                        if (isMobile) {
                          //await timeout(1000); //for 6 sec delay
                        } else {
                          //await timeout(1000); //for 3 sec delay
                        }
                        newRemoteFeedVR(id, display, audio, video);
                        //await timeout(6000); //for 1 sec delay
                      }
                    } else if (msg["leaving"]) {
                      // One of the publishers has gone away?
                      const leaving = msg["leaving"];
                      Janus.log("Publisher left: " + leaving);
                      let remoteFeedVR = null;
                      for (let i = 1; i < total; i++) {
                        if (feeds[i] && feeds[i].rfid === leaving) {
                          remoteFeedVR = feeds[i];
                          break;
                        }
                      }
                      if (remoteFeedVR !== null) {
                        Janus.debug("Feed " + remoteFeedVR.rfid + " (" + remoteFeedVR.rfdisplay + ") has left the room, detaching");
                        //Hay que dejar de mostrar el video que se fue

                        //        setRemote([...remote]);




                        attachMediaStreamRemoto({
                          remoteFeedVR,
                          stream: null,
                          coreUsers,
                          current: remote
                        });

                        habilitarRemoto({
                          remoteFeedVR,
                          value: false,
                          coreUsers,
                          current: remote
                        });



                        feeds[remoteFeedVR.rfindex] = null;
                        remoteFeedVR.detach();
                      }
                    } else if (msg["unpublished"]) {
                      // One of the publishers has unpublished?
                      const unpublished = msg["unpublished"];
                      Janus.log("Publisher left: " + unpublished);
                      if (unpublished === 'ok') {
                        // That's us
                        sfutest.hangup();
                        return;
                      }
                      let remoteFeedVR = null;
                      for (let i = 1; i < total; i++) {
                        if (feeds[i] && feeds[i].rfid === unpublished) {
                          remoteFeedVR = feeds[i];
                          break;
                        }
                      }
                      if (remoteFeedVR != null) {
                        Janus.debug("Feed " + remoteFeedVR.rfid + " (" + remoteFeedVR.rfdisplay + ") has left the room, detaching");
                        //Hay que dejar de mostrar el video del que ha escondido el video


                        //        setRemote([...remote]);



                        attachMediaStreamRemoto({
                          remoteFeedVR,
                          stream: null,
                          coreUsers,
                          current: remote
                        });

                        habilitarRemoto({
                          remoteFeedVR,
                          value: false,
                          coreUsers,
                          current: remote
                        });

                        feeds[remoteFeedVR.rfindex] = null;
                        remoteFeedVR.detach();
                      }
                    } else if (msg["error"]) {
                      if (msg["error_code"] === 426) {
                        // This is a "no such room" error: give a more meaningful description
                        alert("Problemas encontrado la sala de reunión, por favor vuelva a intentarlo");
                      } else {
                        alert("Alert 2 " + msg["error"]);
                      }
                    }
                  }
                }
                if (jsep) {
                  Janus.debug("Handling SDP as well...", jsep);
                  sfutest.handleRemoteJsep({ jsep: jsep });
                  // Check if any of the media we wanted to publish has
                  // been rejected (e.g., wrong or unsupported codec)
                  const audio = msg["audio_codec"];
                  if (mystream && mystream.getAudioTracks() && mystream.getAudioTracks().length > 0 && !audio) {
                    // Audio has been rejected
                    alert("Our audio stream has been rejected, viewers won't hear us");
                  }
                  const video = msg["video_codec"];
                  if (mystream && mystream.getVideoTracks() && mystream.getVideoTracks().length > 0 && !video) {
                    // Video has been rejected
                    alert("Our video stream has been rejected, viewers won't see us");
                    // Hide the webcam video
                    setViewVideoRejected(true);
                  }
                }
              },
              onlocalstream: function (stream) {
                Janus.debug("LOCAL_STREAM", stream);
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
                if (!enableAudioTmp) {
                  sfutest.muteAudio();
                }
                if (!enableVideoTmp) {
                  sfutest.muteVideo();
                }

                //Janus.attachMediaStream($('#myvideo').get(0), stream);
                if (sfutest.webrtcStuff.pc.iceConnectionState !== "completed" &&
                  sfutest.webrtcStuff.pc.iceConnectionState !== "connected") {

                  //Aqui hay que nostrar el efecgto de wait hasta que salga el vide

                }
                const videoTracks = stream.getVideoTracks();
                if (!videoTracks || videoTracks.length === 0) {
                  // No webcam
                  setViewNoWebcam(true);
                } else {
                  setViewNoWebcam(false);
                }
              },
              onremotestream: function (stream) {
                // The publisher stream is sendonly, we don't expect anything here
                // La transmisión del editor es de solo envío, no esperamos nada aquí
              },
              oncleanup: function () {
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
        error: function (error) {
          //Janus.error(error);
          setMensajeError("Algun error " + error);
          setError(true);
        },
        destroyed: function () {
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
      callback: dejarTodoListo
    });
    return () => { // Desmontado del efecto
      if (janusVR) {
        janusVR.destroy();
      }
    };




  }, []); // Solo se ejecuta una sola vez






  //---------------------------------------------------------------------
  // Función callback luego de iniciar janus (Janus.init)
  // Lo unico que se hace es que se activa un flag (janusReady) para que
  // el formulario quede listo para inciar la video conferencia
  //---------------------------------------------------------------------
  const ControlButton = withStyles((theme) => ({
    root: {
      display: 'flex',
      backgroundColor: theme.palette.bgs.azn_light,
      color: theme.palette.bgs.fb_gray,
      height: '1.8em',
      width: '1.8em',
      '&:hover': {
        backgroundColor: theme.palette.bgs.azn_dark,
      },
      "& svg": {
        height: '.72em',
        width: '.72em'
      },
      "&:disabled": {
        color: theme.palette.bgs.fb_gray,
        backgroundColor: '#6d88ad'
      }
    },
  }))(IconButton);

  const SilenciarButton = withStyles((theme) => ({
    root: {
      backgroundColor: "#f5316c",
      color: theme.palette.bgs.fb_gray,
      height: '1.8em',
      width: '1.8em',

      '&:hover': {
        backgroundColor: "#ed094e"
      },
      "& svg": {
        height: '.72em',
        width: '.72em'
      },
      "&:disabled": {
        color: theme.palette.bgs.fb_gray,
        backgroundColor: '#e35982'
      }
    },
  }))(IconButton);

  const RedButton = withStyles((theme) => ({
    root: {
      display: 'flex',
      padding: '.3em',
      backgroundColor: theme.palette.bgs.azn_light,
      color: "#ffffff",
      '&:hover': {
        backgroundColor: theme.palette.bgs.azn_dark,
      },
      "& svg": {
        height: '.69em',
        width: '.69em'
      },
      "&:disabled": {
        color: "#ffffff",
        backgroundColor: '#FA3E3E'
      }
    },
  }))(IconButton);




  function registerUsername(userName, name) {
    if (/[^a-zA-Z0-9]/.test(userName)) {
      alert("Los caracteres deben ser alfanumericos");
      return;
    }





    const register = {
      request: "join",
      room: myroom,
      ptype: "publisher",
      display: userName,
      data: true
    };
    myusername = userName;
    sfutest.send({ message: register });



  }

  function publishOwnFeed() {


    // Publish our stream
    //setViewPublish(false);
    //media: {audioRecv: false, videoRecv: false, audioSend: withAudio, videoSend: true,
    let configVideo = null;
    if (Janus.webRTCAdapter.browserDetails.browser === "firefox") {
      configVideo = true;
    } else {
      configVideo = {
        width: { min: videoWidthMin, ideal: videoWidthIdeal, max: videoWidthMax },
        height: { min: videoHeightMin, ideal: videoHeightIdeal, max: videoHeightMax }
      };
    }
    sfutest.createOffer(
      {
        media: { video: configVideo, data: true },	// Let's negotiate data channels as well
        simulcast: doSimulcast,
        simulcast2: doSimulcast2,
        success: function (jsep) {
          Janus.debug("Got publisher SDP!", jsep);
          var publish = { request: "configure", audio: true, video: userVisibleTmp }; //userVisibleTmp es por si el usuario quiere o no ser invisible al entrar
          sfutest.send({ message: publish, jsep: jsep });


          //---------------------------------------------------------------------
          // Lo siguiente es para volver a poner el audio y el video como estaban
          //---------------------------------------------------------------------
          if (!enableAudioTmp) {
            sfutest.muteAudio();
          }
          if (!enableVideoTmp) {
            sfutest.muteVideo();
          }
          doChangeDevice(idDeviceInputAudioTmp, idDeviceInputVideoTmp, idDeviceOutputAudioTmp);
          setUserVisible(userVisibleTmp);
        },
        error: function (error) {
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
        success: function () { },
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







  function isNullMediaStreamRemoto(rfindex) {
    const i = rfindex - 1;
    const payload = { ...remote[i] };
    if (
      payload
      && payload.ref
      && payload.ref.current
      && payload.ref.current.srcObject === null) {
      return true;
    }
    return false;
  }

  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  function newRemoteFeedVR(id, display, audio, video) {
    // A new feed has been published, create a new plugin handle and attach to it as a subscriber
    let remoteFeedVR = null;
    janusVR.attach(
      {
        plugin: "janus.plugin.videoroom",
        opaqueId: opaqueId,
        success: function (pluginHandle) {
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
          if (Janus.webRTCAdapter.browserDetails.browser === "safari" &&
            (video === "vp9" || (video === "vp8" && !Janus.safariVp8))) {
            if (video)
              video = video.toUpperCase()
            alert("Publisher is using " + video + ", but Safari doesn't support it: disabling video");
            subscribe["offer_video"] = false;
          }
          remoteFeedVR.videoCodec = video;
          remoteFeedVR.send({ message: subscribe });
        },
        error: function (error) {
          Janus.error("  -- Error attaching plugin...", error);
          alert("Error attaching plugin... " + error);
        },
        onmessage: function (msg, jsep) {
          Janus.debug(" ::: Got a message (subscriber) :::", msg);
          const event = msg["videoroom"];
          Janus.debug("Event: " + event);
          if (msg["error"]) {
            alert("Alert 1 " + msg["error"]);
            consoloe.log(msg);
            console.log(jsep);
          } else if (event) {
            if (event === "attached") {
              // Subscriber created and attached
              for (let i = 1; i < total; i++) {
                if (!feeds[i]) {
                  feeds[i] = remoteFeedVR;
                  remoteFeedVR.rfindex = i;
                  break;
                }
              }
              remoteFeedVR.rfid = msg["id"];
              remoteFeedVR.rfdisplay = msg["display"];
              Janus.log("HABILITANDO STEP :::::[1]::::::::Successfully attached to feed " + remoteFeedVR.rfid + " (" + remoteFeedVR.rfdisplay + ") in room " + msg["room"]);

              //HABILITANDO DE VERDAD


              habilitarRemoto({
                remoteFeedVR,
                value: true,
                coreUsers,
                current: remote
              });
              sfutest.send({
                message: {
                  "request": "listparticipants",
                  "room": myroom,
                },
                success: participantsCb
              });



            } else if (event === "event") {
              // Check if we got a simulcast-related event from this publisher
              const substream = msg["substream"];
              const temporal = msg["temporal"];
              if ((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                //Aqui se controla el simulcast, pero nosotros no lo usaremos 
              }
            } else {
              // What has just happened? // Que ha ocurrido
            }
          }
          if (jsep) {
            Janus.debug("Handling SDP as well...", jsep);
            // Answer and attach
            remoteFeedVR.createAnswer(
              {
                jsep: jsep,
                // Add data:true here if you want to subscribe to datachannels as well
                // (obviously only works if the publisher offered them in the first place)
                media: { audioSend: false, videoSend: false, data: true },	// We want recvonly audio/video
                success: function (jsep) {
                  Janus.debug("Got SDP!", jsep);
                  var body = { request: "start", room: myroom };
                  remoteFeedVR.send({ message: body, jsep: jsep });
                },
                error: function (error) {
                  Janus.error("WebRTC error:", error);
                  alert("WebRTC error... " + error.message);
                }
              });
          }
        },
        iceState: function (state) {
          Janus.log("ICE state of this WebRTC PeerConnection (feed #" + remoteFeedVR.rfindex + ") changed to " + state);
        },
        webrtcState: function (on) {
          Janus.log("Janus says this WebRTC PeerConnection (feed #" + remoteFeedVR.rfindex + ") is " + (on ? "up" : "down") + " now");
        },
        onlocalstream: function (stream) {
          // The subscriber stream is recvonly, we don't expect anything here
        },
        onremotestream: function (stream) {

          //console.log("Esto tengo al REMOTO");
          //console.log(remoteFeedVR);
          Janus.debug("Remote feed #" + remoteFeedVR.rfindex + ", stream:", stream);
          let addButtons = false;

          if (isNullMediaStreamRemoto(remoteFeedVR.rfindex)) {
            addButtons = true;
          }
          //        setRemote([...remote]);





          habilitarNoRemotoVideo({
            remoteFeedVR: remoteFeedVR,
            value: false,
            cb: null
          });

          attachMediaStreamRemoto({
            remoteFeedVR,
            stream: stream,
            coreUsers,
            current: remote,
            cb: () => setAudioOutput(remoteFeedVR.rfindex, idDeviceOutputAudioTmp)
          });
          //----------------------------------------------------------------------------------------
          // Si estoy compartiendo pantalla, les envio la señal para que ser una a la presentación
          //----------------------------------------------------------------------------------------
          if (thisUserSharing) {
            sendMessage('@@IDSHR@@' + room);
          }
          //setAudioOutput(remoteFeed.rfindex, idDeviceOutputAudio);

          const videoTracks = stream.getVideoTracks();
          if (!videoTracks || videoTracks.length === 0) {
            // No remote video

            //        setRemote([...remote]);



            habilitarNoRemotoVideo({
              remoteFeedVR: remoteFeedVR,
              value: true,
              cb: setMessageNoViewVideo('No puedo nostrar video 1')
            });

            attachMediaStreamRemoto({
              remoteFeedVR,
              stream: null,
              coreUsers,
              current: remote
            });

          } else {
            //alert("listo se muestra el video");
            //habilitarNoRemotoVideo(remoteFeedVR.rfindex,false,' '); 
          }
          if (!addButtons)
            return;
          if (Janus.webRTCAdapter.browserDetails.browser === "chrome" || Janus.webRTCAdapter.browserDetails.browser === "firefox" ||
            Janus.webRTCAdapter.browserDetails.browser === "safari") {
            // Aqui se puede sacar las dimenciones del video reciido
            //const curres = getDimensionStream(remoteFeedVR.rfindex);
          }
        },
        ondata: function (data) {
          // aqui poner el setState para mandar el mensaje
          Janus.debug("We got data from the DataChannel! " + data);
          let posHastack = data.indexOf('@@IDSHR@@');
          let data2 = data;
          if (posHastack >= 0) {
            data2 = data.substr(posHastack + 9);
            room = data2;
            joinScreen(room);
          } else {
            if (data === "MUTEALL_ACTION") {
              clickToggleAudio()
            }
          }
        },
        oncleanup: function () {
          Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
          //Aqui se puede parar la animación

          //        setRemote([...remote]);



          habilitarNoRemotoVideo({
            remoteFeedVR: remoteFeedVR,
            value: true,
            cb: setMessageNoViewVideo('No puedo nostrar video 2')
          });

          attachMediaStreamRemoto({
            remoteFeedVR,
            stream: null,
            coreUsers,
            current: remote
          });
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
    devices.forEach(function (device) {
      var label = device.label;
      if (!label || label === "")
        label = device.deviceId;
      if (device.kind === 'audioinput') {
        deviceInputAudio.push({ id: device.deviceId, viewValue: label });
      } else if (device.kind === 'videoinput') {
        deviceInputVideo.push({ id: device.deviceId, viewValue: label });
      } else if (device.kind === 'audiooutput') {
        // Apparently only available from Chrome 49 on?
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId
        // Definitely missing in Safari at the moment: https://bugs.webkit.org/show_bug.cgi?id=179415
        deviceOutputAudio.push({ id: device.deviceId, viewValue: label });
      }
    });

    if (deviceOutputAudio.length === 0) { //ocurre en safary y firefox
      deviceOutputAudio.push({ id: "default", viewValue: "Defaul Speaker" });
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

  function newLocalFeed() {
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
          //__HOOKA


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
  function clickUserVisibility() {
    const newVal = !userVisible;
    userVisibleTmp = newVal;
    if (!streamLocal) {
      setUserVisible(newVal);
    } else {
      if (!newVal) {
        unpublishOwnFeed();
      } else {
        publishOwnFeed();
      }
    }
  }

  function clickToggleAudio() {
    const newVal = !toggleAudio;
    enableAudioTmp = newVal;
    setToggleAudio(newVal);
    if (streamLocal) {
      if (newVal) {
        sfutest.unmuteAudio();
      } else {
        sfutest.muteAudio();
      }
    }
    Janus.log((newVal ? "Unmuting Audio" : "Muting Audio") + " local stream...");
  }

  function clickToggleVideo() {
    const newVal = !toggleVideo;
    enableVideoTmp = newVal;
    setToggleVideo(newVal);
    if (streamLocal) {
      if (newVal) {
        sfutest.unmuteVideo();
      } else {
        sfutest.muteVideo();
      }
    }
    Janus.log((newVal ? "Unmuting Video" : "Muting Video") + " local stream...");
  }

  function clickChangeDevice(valueAudioIn, valueVideoIn, valueAudioOut) {
    idDeviceInputAudioTmp = valueAudioIn;
    idDeviceInputVideoTmp = valueVideoIn;
    idDeviceOutputAudioTmp = valueAudioOut;
    if (streamLocal) {
      doChangeDevice(valueAudioIn, valueVideoIn, valueAudioOut);
    }
  }

  function doChangeDevice(valueAudioIn, valueVideoIn, valueAudioOut) {

    //alert(idDeviceOutputAudio + "===" + valueAudioOut);
    //alert(idDeviceInputAudio + "===" + valueAudioIn);
    let replaceAudio = idDeviceInputAudio !== valueAudioIn;
    idDeviceInputAudio = valueAudioIn;
    let replaceVideo = idDeviceInputVideo !== valueVideoIn;
    idDeviceInputVideo = valueVideoIn;
    //alert("adioIn=>" + valueAudioIn + " videoIn=>" + valueVideoIn + "audioOut=>" + valueAudioOut);
    let configVideo = null;
    if (Janus.webRTCAdapter.browserDetails.browser === "firefox") {
      configVideo = {
        deviceId: {
          exact: idDeviceInputVideo
        }
      };
    } else {
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
          data: true
        },	// ... let's negotiate data channels as well
        // If you want to test simulcasting (Chrome and Firefox only), then
        // pass a ?simulcast=true when opening this demo page: it will turn
        // the following 'simulcast' property to pass to janus.js to true
        simulcast: doSimulcast,
        success: function (jsep) {
          Janus.debug("Got SDP!");

          //::[2] CONFIRMAMOS LOS AJUSTTES DEL CLIENTE
        },
        error: function (error) {
          Janus.error("WebRTC error...", error);
          alert("WebRTC error... " + error);
        }
      });
    if (streamLocal) {
      setViewModal(99)

      let replaceAudioOut = idDeviceOutputAudio !== valueAudioOut;
      idDeviceOutputAudio = valueAudioOut;
      if (replaceAudioOut) {
        Janus.log('Audio output device attached:', idDeviceOutputAudio);
        changeDeviceOutput(valueAudioOut);
      }
    }
  }

  function goSetAudioOutput(refStream, valueAudioOut) {
    if (typeof refStream.current.setSinkId == 'function') { ////ocurre en safary y firefox que no existe esta funcion
      refStream.current.setSinkId(valueAudioOut);
    }
    idDeviceOutputAudio = valueAudioOut;
  }




  function setAudioOutput(rfindex, valueAudioOut) {

    if (rfindex) {
      const i = rfindex - 1;
      const payload = { ...remote[i] };
      if (payload.ref.current.srcObject !== null) {
        goSetAudioOutput(payload.ref, valueAudioOut)
      }
      idDeviceOutputAudio = valueAudioOut;
    }


  }


  function changeDeviceOutput(valueAudioOut) {
    for (let index = 1; index < total; index++) {
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
        success: function (pluginHandle) {
          remoteFeed = pluginHandle;
          Janus.log("Plugin attached! (" + remoteFeed.getPlugin() + ", id=" + remoteFeed.getId() + ")");
          Janus.log("  -- This is a subscriber");
          // We wait for the plugin to send us an offer
          var listen = { "request": "join", "room": room, "ptype": "listener", "feed": id };
          remoteFeed.send({ "message": listen });
        },
        error: function (error) {
          Janus.error("  -- Error attaching plugin...", error);
          //bootbox.alert("Error attaching plugin... " + error);
          setMensajeError("Error attaching plugin... " + error);
          setError(true);
        },
        onmessage: function (msg, jsep) {

          Janus.debug(" ::: Got a message (listener) :::");
          Janus.debug(msg);
          var event = msg["videoroom"];
          Janus.debug("Event 1: " + event);
          if (event != undefined && event != null) {
            if (event === "attached") {
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
          if (jsep !== undefined && jsep !== null) {
            Janus.debug("Handling SDP as well...");
            Janus.debug(jsep);
            // Answer and attach
            //alert("estoy ne respuesta");
            remoteFeed.createAnswer(
              {
                jsep: jsep,
                media: { audioSend: false, videoSend: false },	// We want recvonly audio/video
                success: function (jsep) {
                  Janus.debug("Got SDP!");
                  Janus.debug(jsep);
                  var body = { "request": "start", "room": room };
                  remoteFeed.send({ "message": body, "jsep": jsep });
                },
                error: function (error) {
                  Janus.error("WebRTC error:", error);
                  //bootbox.alert("WebRTC error... " + error);
                  setMensajeError("WebRTC error... " + error);
                  setError(true);
                }
              });
          }
        },
        onlocalstream: function (stream) {
          console.error('ERROR AQUI')
        },
        onremotestream: function (stream) {
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
        oncleanup: function () {
          Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
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
    if (!Janus.isExtensionEnabled()) {
      alert("Descargue la siguiente extensión de chrome para continuar <b><a href='https://chrome.google.com/webstore/detail/janus-webrtc-screensharin/hapfgfdkleiggjjpfpenajgdnfckjpaj' target='_blank'>here</a></b> to do so");
      return;
    }
    if (typeof window.navigator.mediaDevices.getDisplayMedia === "undefined") {
      alert("Compartir pantalla no es posible en este dispositivo");
      return;
    }

    capture = "screen";
    role = "publisher";

    if (firstTime) {
      // Create a new room

      let desc = titleShared;
      let create = { "request": "create", "description": desc, "bitrate": 500000, "publishers": 1 };
      screentest.send({
        "message": create, success: function (result) {
          var event = result["videoroom"];
          Janus.debug("Event 3: " + event);
          if (event != undefined && event != null) {
            // Our own screen sharing session has been created, join it
            room = result["room"];
            Janus.log("Screen sharing session created: " + room);
            myusername = Janus.randomString(12);
            //idPublisher = randomString(9);
            var register = { "request": "join", "room": room, "ptype": "publisher", "display": myusername };
            screentest.send({ "message": register });
          }
        }
      });
      firstTime = false;
    } else {
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
            //sendMessage('@@IDRESHR@@' + idPublisher);
            sendMessage('@@IDSHR@@' + room);


          },
          error: function (error) {
            console.error("WebRTC error:", error)
            Janus.error("WebRTC error:", error);
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
    screentest.send({ "message": register });
  }

  async function clickUnPublish() {
    var register = { "request": "unpublish" };
    screentest.send({ "message": register });
    resetSharing();
  }


  //_DEVHOOK

  const [openDebug, setOpenDebug] = useState(true);
  const [sharingModal, setSharingModal] = useState(false);
  const [viewModal, setViewModal] = useState(0);



  return (
    <Main>




      <SettingsModal translate={viewModal}>

        <SettingsView>



          <Section>

            <SwitchItem>
              <RedButton >
                <VideocamRounded />
              </RedButton>
              <Switch
                checked={toggleVideo}
                onChange={clickToggleVideo}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </SwitchItem>


            <SwitchItem>
              <RedButton >
                <MicRounded />
              </RedButton>
              <Switch
                checked={toggleAudio}
                onChange={clickToggleAudio}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />

            </SwitchItem>

            <Button
              color="secondary"
              disabled={false}
              size="large"
              type="button"
              variant="outlined"
              onClick={() => dejarTodoListo()}
            >
              {(!viewJoinRoom && !viewVideos) ? 'Iniciar' : 'SALIR'}
            </Button>
            <Button
              hidden={!pluginVRReady}
              color="secondary"
              disabled={!pluginVRReady || userJoinedRoom}
              size="large"
              type="button"
              variant="contained"
              onClick={() => registerUsername(me.nameUserJoin, me.name)}
            >
              ENTRAR
            </Button>
          </Section>

          <Section hidden={!pluginVRReady} >
            <Typography variant="h4">
              Cambiar dispositivos
            </Typography>


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
            <Button
              color="secondary"
              size="large"
              type="button"
              variant="contained"
              onClick={() => clickChangeDevice(optionAudioIn.value, optionVideoIn.value, optionAudioOut.value)}
            >
              Cambiar
            </Button>
          </Section>



          <Section>
            <Button color="secondary" size="large" type="button" variant="outlined" onClick={() => setViewModal(99)}>
              Ocultar Menu
            </Button>
          </Section>


        </SettingsView>

      </SettingsModal>



      <ControlsView>
        <ControlsBar>

          <ControlButton

            disabled={!pluginSHReady || userReciveSharing || userSharing}

            onClick={() => shareScreen(Janus.randomString(12))}
          >
            <AirplayRounded />
          </ControlButton>


          <ControlButton onClick={() => clickToggleVideo()}>
            {toggleVideo ? <VideocamRounded /> : <VideocamOffRounded />}
          </ControlButton>
          <ControlButton onClick={() => clickToggleAudio()}>
            {toggleAudio ? <MicRounded /> : <MicOffRounded />}
          </ControlButton>



          <SilenciarButton onClick={() => sendMessage("MUTEALL_ACTION")}>
            <RecordVoiceOver />
          </SilenciarButton>

          <ControlButton onClick={() => setViewModal(viewModal === 99 ? 0 : 99)}>
            {
              viewModal === 99 ? <MenuRounded /> : <X />
            }
          </ControlButton>
        </ControlsBar>
      </ControlsView>





      {/* :::::::::: VIDEOS SECTION :::::::::: */}


      <ScreenSharingView
        style={{ display: !userReciveSharing && !userSharing ? 'none' : '' }}
      >
        <video
          autoPlay playsInline muted="muted"
          style={{ display: !userReciveSharing ? 'none' : '' }}
          ref={refStream}
        />
        <div
          hidden={!userSharing}
        >
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
      </ScreenSharingView>



      <VideoList hidden={!viewVideos}>
        <VideoItem hidden={!userVisible} >

          <video
            id="videoLocal"
            style={{ width: '100%', height: '100%' }}
            hidden={!userVisible}
            ref={refStreamLocal}
            autoPlay
            playsInline
            muted="muted"
          />

          <h3> {me.nameUserJoin} - {me.nombres} </h3>

          <h3 hidden={!viewNoWebcam}>No disponible Webcam</h3>

          <h3 hidden={!viewVideoRejected}>
            Su video no podra ser mostrado con los demas
          </h3>

        </VideoItem>

        {
          remote.map((item, index) =>
            <VideoItem nameUserJoin={!item.nameUserJoin} isRemote>


              <h3>
                {
                  participants
                  && participants.length
                  && participants[index]
                  && `${participants[index].display} - ${participants[index].name}`
                }

              </h3>

              <video
                ref={item.ref} autoPlay playsInline
                style={{ width: '100%', height: '100%' }}
              />

            </VideoItem>
          )
        }
      </VideoList>

      {/* :::::::::: END VIDEOS SECTION :::::::::: */}




      {/* <Debug>


        {(mensajeError) ? <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {mensajeError}
        </Alert> : " "}
      </Debug> */}






    </Main>
  );
}

export default VideoRoomTest;



const Main = styled.div`
  height: 100vh;
  width: 100vw;
  max-height: 100vh;
  max-width: 100vw;
  overflow-y: scroll;
  overflow-x: hidden;
 
  background-color: ${palette.bgs.azn_dark};
  button {
  border-radius:1.5em;
  }
`

const ScreenSharingView = styled.div`
 height: 50vh;
 width: 100%;
 display: flex;
 justify-content: center;
background-color: #000000;


 video {
  /* border-radius: 9pt; */
  height: 100%;

  @media only screen and (min-width: ${MEDIA_SCREENS.XS.FROM}px) and (max-width: ${MEDIA_SCREENS.XS.TO}px)  {
    width: 100%;

  }


 }

 margin-bottom: .3em;
 align-items:center;
  
`


const SwitchItem = styled.div`
    display:flex;
    width:100%;
    justify-content:space-between;
    align-items:center;
`


const VideoList = styled.div`
  background-color: ${palette.bgs.fb};
  display: grid;
  /* grid-gap: .6em; */
  @media only screen and (min-width: ${MEDIA_SCREENS.XS.FROM}px) and (max-width: ${MEDIA_SCREENS.XS.TO}px)  {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: minmax(0, 24vh);
  }
  @media only screen and (min-width: ${MEDIA_SCREENS.SMALL.FROM}px) and (max-width: ${MEDIA_SCREENS.SMALL.TO}px)  {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: minmax(0, 24vh);
  }
  @media only screen and (min-width: ${MEDIA_SCREENS.MEDIUM.FROM}px)   {
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: minmax(0, 30vh);
  }  
  max-height: 100vh;
  overflow-y: scroll;
  margin-bottom: 6em;
`

const VideoItem = styled.div`



  visibility:  ${props => props.nameUserJoin && 'hidden'} ;


    ${props => props.isRemote && `
       
          border: 1px solid;
          border-image: linear-gradient(45deg, #73f250,  #edff29) 1;
      `

  }



   

    

    width:100%;
    background-color:${palette.bgs.azn_dark};
    position: relative;
    display: flex;
    h3{
        padding:.3em;
        position:absolute;
        font-size:.9em;
        font-family: Arial, Helvetica, sans-serif;
        bottom:0;
        right: 0;
        border-radius: 3pt;
        color: white;
        width: 100%;
        background-color:rgba(0, 0, 0, 0.58);
    }
    video {
      width: 100%;
    }
`

const Debug = styled.div` 
top:0;
position: absolute;
`

const Section = styled.div`
  display:${props => props.hidden ? 'none' : 'flex'};
  flex-direction: column;
  padding:.9em;
  background-color: white;
  > * {
          margin-bottom:1em;
    };
  h3{
    margin:1.2em;
    position:absolute;
    color:white;
    font-size:.9em;
    font-family: Arial, Helvetica, sans-serif;
    bottom:0;
    text-transform: capitalize;

  }

  flex:1;
`;







const SettingsModal = styled.div`
      min-height: 100vh;
      display:flex;
      top:0;
      right: 0;
      position: absolute;
      z-index: 10;
      will-change: transform;
      transition: .3s ease;
      transform: translateX(${props => props.translate && props.translate + '%'});  


      @media only screen and (min-width: ${MEDIA_SCREENS.XS.FROM}px) and (max-width: ${MEDIA_SCREENS.XS.TO}px)  {
        width: 100vw;
        overflow-y: scroll;
  }

  margin-bottom: 20em;


`


const SettingsView = styled.div`
    width: 30em;
    display: flex;
    flex-direction: column;
    border-color: red;
`;






const ControlsView = styled.div`
    visibility:${props => props.hidden ? 'hidden' : ''};
    z-index:6;
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom:0;
    width: 100%;

    
`;

const ControlsBar = styled.div`
    background-color:${palette.bgs.babyPower};
    display:flex;
    justify-content:center;
    padding:.2em;
    > * {
      margin-right:.3em;
    }  
`