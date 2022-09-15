/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-else-return */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, TextField, Input, Box, IconButton, ButtonBase, makeStyles, useMediaQuery, } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { fgDigitalConfig } from 'src/config';
import { ContactSupportOutlined } from '@material-ui/icons';
import { CardHeader, Card, CardContent } from '@material-ui/core';

import { Document, Page, pdfjs } from "react-pdf";
import { isMobile, isEdgeChromium } from "react-device-detect";
import { isConstructorDeclaration } from 'typescript';
import Controls from './newElements/Controls';

import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Video as VideoCallIcon,
  VideoOff as VideoOffIcon,
  Sliders as SlidersIcon,
  X as CloseIcon,
  ChevronLeft,
  ChevronRight
} from 'react-feather';
import CustomModal from './elments/CustomModal';
import { useSnackbar } from 'notistack';
import CardButton from './newElements/CardButton';


import { callAsset, uploadAsset, helpAsset } from './newElements/assets'
import DebugDialog from 'src/components/common/DebugDialog';
import CardButtonList from './newElements/CardButtonList';
import { RenderVideo, RenderShare, View, MainSide, SecondarySide, VideoContainer, Sharecontainer } from './newElements/RenderVideos';
import TitleDescription from 'src/components/TitleDescription';
import Feedback from './newElements/Feedback';
import { useHistory } from 'react-router';



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;






//----------------------------------------------------
// Janus Gateway: Variables globales para video call
//----------------------------------------------------
const server = fgDigitalConfig.server_rtc;

var janusVC = null;
var videocall = null;

var myusername = null;
var yourusername = null;
let remoteFeed = null;

var doSimulcast = (getQueryStringValue("simulcast") === "yes" || getQueryStringValue("simulcast") === "true");
var acodec = (getQueryStringValue("acodec") !== "" ? getQueryStringValue("acodec") : null);
var vcodec = (getQueryStringValue("vcodec") !== "" ? getQueryStringValue("vcodec") : null);
var vprofile = (getQueryStringValue("vprofile") !== "" ? getQueryStringValue("vprofile") : null);
var isPdf = false;

var globalJsep;

let idDeviceInputAudio = null;
let idDeviceOutputAudio = null;
let idDeviceInputVideo = null;
let idDeviceInputAudioTmp = null;
let idDeviceOutputAudioTmp = null;
let idDeviceInputVideoTmp = null;

let enableAudioTmp = true;
let enableVideoTmp = true;

let deviceInputAudio = [];
let deviceInputVideo = [];
let deviceOutputAudio = [];

let globalSharingJsep = null;
let idPublisher = null;
let canvasStreamLocalCall = null;
let userCallingLocalTmp = false;
let gobalStreamLocal = null;




//----------------------------------------
// Variables para resolucion de pantalla
//----------------------------------------
let videoWidthMin = 960;
let videoWidthIdeal = 960;
let videoWidthMax = 960;
let videoHeightMin = 540;
let videoHeightIdeal = 540;
let videoHeightMax = 540;

//------------------------------------------------
// Janus Gateway: Variables globales para sharing
//------------------------------------------------
let janusShr = null;
let screentest = null;
let myid = null;

let capture = null;
let role = null;
let room = null;
let source = null;

let firstTime = true;
let thisUserSharing = false;




function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

function getQueryStringValue(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    /* eslint-disable-next-line no-restricted-globals */
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function timeout(delay) {
  return new Promise(res => setTimeout(res, delay));
}




function VideoCallSharingTest({
  callerName,
  peerName,
  autoservicioCb,
  logged,
  dateText
}) {


  const { enqueueSnackbar } = useSnackbar();


  const classes = {};
  const Janus = window.Janus;
  const opaqueId = "videocalltest-" + Janus.randomString(12);
  const [error, setError] = useState(false);
  const [janusReady, setJanusReady] = useState(false);
  const [pluginVCReady, setPluginVCReady] = useState(false);
  const [pluginSHReady, setPluginSHReady] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [streamLeft, setStreamLeft] = useState(false);
  const [streamRight, setStreamRight] = useState(false);

  const [screenShotStatus, setScreenShotStatus] = useState(false);

  const [toggleAudio, setToggleAudio] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(true);
  const [dataRecive, setDataRecive] = useState('');

  const [userTalking, setUserTalking] = useState(false);
  const [userCallingLocal, setUserCallingLocal] = useState(false);
  const [userCalling, setUserCalling] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);


  const refStreamLeft = useRef(null);
  const refStreamRight = useRef(null);
  const refCanvasVideoLocal = useRef(null);
  const refImgTakeSnapshot = useRef(null);
  const refImg2TakeSnapshot = useRef(null);
  const refCanvasTakeSnapshot = useRef(null);
  const refCanvas2TakeSnapshot = useRef(null);

  const [openCallMessage, setOpenCallMessage] = useState(false);
  const [viewReadyVideo, setViewReadyVideo] = useState(false);
  const [receivingVideo, setReceivingVideo] = useState(false);

  let contCanvas = 0;
  let canvasTimer = null;


  //------------------------------
  //Esto es para sharing
  //------------------------------
  const [userSharing, setUserSharing] = useState(false);
  const [userReciveSharing, setUserReciveSharing] = useState(false);
  //const [sharingReady, setSharingReady] = useState(false);  
  const refStream = useRef(null);


  //

  //

  const [displaySnapshot, setDisplaySnapshot] = useState(false);


  //::::::::::::::::::::::::::::___NEW_DEV
  const [bugDialog, setBugDialog] = useState([]);
  const [translate, setTranslate] = useState(0);
  const [callSettingsDialog, setCallSettingsDialog] = useState({
    openSettings: false,
    callReady: false,
  });
  const [feedback, setFeedback]=useState(null);
  const history = useHistory()



  function listDevices(devices) {
    deviceInputAudio = [];
    deviceInputVideo = [];
    deviceOutputAudio = [];

    try{
      devices.forEach(function (device) {
        var label = device.label;
        if (!label || label === "")
          label = device.deviceId;
        //var option = $('<option value="' + device.deviceId + '">' + label + '</option>');
        if (device.kind === 'audioinput') {
          deviceInputAudio.push({ id: device.deviceId, viewValue: label });
          //$('#audio-device').append(option);
        } else if (device.kind === 'videoinput') {
          deviceInputVideo.push({ id: device.deviceId, viewValue: label });
          //$('#video-device').append(option);
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
  
      //FIX_3 REGISTRAR  AUTOMATICAMENTE CALLER NAME.
      registerUsername(callerName);
  
    }catch(e){
      console.log('Error en');
      setFeedback({
        title:'Dispositivos no encontrados',
        body:"Camara y/o voz no encontrados. Por favor verifique e intente nuevamente.",
        action:'Intentar de nuevo',
        trigger:()=> history.go(0)
      });
    }
   

  }

  function setCallDevices(valueAudioIn, valueVideoIn, valueAudioOut) {
    let replaceAudio = idDeviceInputAudio !== valueAudioIn;
    idDeviceInputAudio = valueAudioIn;
    let replaceVideo = idDeviceInputVideo !== valueVideoIn;
    idDeviceInputVideo = valueVideoIn;

    if (userTalking) {
      let replaceAudioOut = idDeviceOutputAudio !== valueAudioOut;
      idDeviceOutputAudio = valueAudioOut;
      if (replaceAudioOut) {
        Janus.log('Audio output device attached:', idDeviceOutputAudio);
        if (typeof refStreamRight.current.setSinkId == 'function') { ////ocurre en safary y firefox que no existe esta funcion
          goSetAudioOutput(refStreamRight, valueAudioOut);
        }
      }
    }

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

    if (!userCallingLocalTmp) {

      videocall.createOffer(
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
            //Janus.debug(jsep);
            //var body = { "request": "call", "username": userName };
            //videocall.send({"message": body, "jsep": jsep});
          },
          error: function (error) {
            Janus.error("WebRTC error...", error);
            setFeedback({
              title:'Error al intentar establecer llamada',
              body:"Por favor intente nuevamente.",
              action:'Intentar de nuevo',
              trigger:()=> history.go(0)
            });          
          }
        });
    }


  }


  function setDevices(valueAudioIn, valueVideoIn, valueAudioOut, callback) {
    
    idDeviceInputAudioTmp = valueAudioIn;
    idDeviceInputVideoTmp = valueVideoIn;
    idDeviceOutputAudioTmp = valueAudioOut;
    if (userTalking) {
      setCallDevices(valueAudioIn, valueVideoIn, valueAudioOut);
      callback();

    }
  }


  function runCall(userName) {
    // Call someone
    if (userName === "") {
      return;
    }
    if (/[^a-zA-Z0-9]/.test(userName)) {
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
        success: function (jsep) {
          Janus.debug("Got SDP!");
          Janus.debug(jsep);
          var body = { "request": "call", "username": userName };
          videocall.send({ "message": body, "jsep": jsep });
          setTranslate(81)
        },
        error: function (error) {
          Janus.error("WebRTC error...", error);
          setFeedback({
            title:'Error al intentar establecer llamada',
            body:"Por favor intente nuevamente.",
            action:'Intentar de nuevo',
            trigger:()=> history.go(0)
          });     
         
        }
      });
  }



  function runSettings() {
    
    const callReady = callSettingsDialog && callSettingsDialog.callReady;
    const onCallready = callReady ?

      runCall(peerName)


      : () => { }
    setDevices(optionAudioIn.value, optionVideoIn.value, optionAudioOut.value, onCallready)
    setCallSettingsDialog({
      openSettings: false,
      callReady: false,
    })
  };




  //::::::::::::::::::::::::___NEW_DEV


  function setPassiveState() {
    enableAudioTmp = true;
    enableVideoTmp = true;
    setViewReadyVideo(false);
  }

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
          setTranslate(81)
        },
        error: function (error) {
          Janus.error("WebRTC error:", error);
          setFeedback({
            title:'Error al intentar establecer llamada',
            body:"Por favor presione continuar y  espere que su asesor lo vuelva a llamar.",
            action:'Continuar',
            trigger:()=> history.go(0)
          });     
        }
      });
    setOpenCallMessage(false);
  };


  //--------------------------------------------------------------
  // Funciones para compartir archivos
  //--------------------------------------------------------------


  const [urlNamePdf, setUrlNamePdf] = useState(null);

  function doSelectFileToDisck() {
    isPdf = true
    refFileSelector.current.click();
    setUserSelectPDF(true);
  }

  const handFileSystem = async (event) => {
    const fileList = event.target.files;
    if (fileList[0].type && fileList[0].type.indexOf('image') >= 0) {
      setUserSelectPDF(false);
      let imageStream = refImageStream.current;
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        imageStream.src = event.target.result;
      });
      reader.readAsDataURL(fileList[0]);
    } else if (fileList[0].type && fileList[0].type.indexOf('pdf') >= 0) {
      setUserSelectPDF(true);
      setUrlNamePdf(fileList[0]);
    } else {
      setUserSelectPDF(false);
      alert("Archivo no permitido");
    }

    //console.log(fileList);
  };

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page 
  const [userSelectPDF, setUserSelectPDF] = useState(false); //setting 1 to show fisrt page 
  const refCanvasStream = useRef(null);
  const refCanvasPage = useRef(null);
  const refFileSelector = useRef(null);
  const refImageStream = useRef(null);
  const refVideoStream = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
    shareScreen(Janus.randomString(12));
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

  function onRenderPage() {
    //grab the context from your destination canvas
    let canvasStream = refCanvasStream.current;
    let destCtx = canvasStream.getContext('2d');
    destCtx.clearRect(0, 0, canvasStream.width, canvasStream.height);
    let canvasPage = refCanvasPage.current;
    reduceImageSize(canvasStream, canvasPage);
    //canvasStream.width = 768;
    //canvasStream.height = 432;
    destCtx.drawImage(canvasPage, 0, 0, canvasStream.width, canvasStream.height);
  }

  function onRenderImage() {
    let canvasStream = refCanvasStream.current;
    let destCtx = canvasStream.getContext('2d');
    destCtx.clearRect(0, 0, canvasStream.width, canvasStream.height);
    let imageStream = refImageStream.current;
    reduceImageSize(canvasStream, imageStream);
    //canvasStream.width = 432;
    //canvasStream.height = 768;
    destCtx.drawImage(imageStream, 0, 0, canvasStream.width, canvasStream.height);
    shareScreen(Janus.randomString(12));
  }

  function reduceImageSize(canvasStream, imageStream) {
    const baseSizeWidth = 432;
    const baseSizeHeight = 768;
    let reductionFactor = 0;
    let sizeTmp = 0;
    let isVerical = (imageStream.height > imageStream.width);

    if (isVerical) {
      if (imageStream.width > baseSizeWidth) {
        reductionFactor = baseSizeWidth / imageStream.width;
        if ((imageStream.height * reductionFactor) > baseSizeHeight) {
          reductionFactor = baseSizeHeight / imageStream.height;
        }
      } else if (imageStream.height > baseSizeHeight) {
        reductionFactor = baseSizeHeight / imageStream.height;
      }
    } else {
      if (imageStream.height > baseSizeWidth) {
        reductionFactor = baseSizeWidth / imageStream.height;
        if ((imageStream.width * reductionFactor) > baseSizeHeight) {
          reductionFactor = baseSizeHeight / imageStream.width;
        }
      } else if (imageStream.width > baseSizeWidth) {
        reductionFactor = baseSizeWidth / imageStream.width;
      }
    }
    canvasStream.width = Math.round(imageStream.width * reductionFactor);
    canvasStream.height = Math.round(imageStream.height * reductionFactor);
  }

  function sendFileCanvas(pluginHandle, sendMessageJoin) {
    //$('#details').remove();
    let echotest = pluginHandle;

    let canvas = refCanvasStream.current;
    let canvasStream = canvas.captureStream();

    Janus.log("Plugin attached! (" + echotest.getPlugin() + ", id=" + echotest.getId() + ")");
    // Negotiate WebRTC
    var body = { "audio": false, "video": true };
    // We can try and force a specific codec, by telling the plugin what we'd prefer
    // For simplicity, you can set it via a query string (e.g., ?vcodec=vp9)
    //if(acodec)
    //  body["audiocodec"] = acodec;
    //if(vcodec)
    //  body["videocodec"] = vcodec;
    Janus.debug("Sending message (" + JSON.stringify(body) + ")");
    //echotest.send({"message": body});
    Janus.debug("Trying a createOffer too (audio/video sendrecv)");


    echotest.createOffer(
      {
        // No media provided: by default, it's sendrecv for audio and video
        stream: canvasStream,	// Let's negotiate data channels as well
        // If you want to test simulcasting (Chrome and Firefox only), then
        // pass a ?simulcast=true when opening this demo page: it will turn
        // the following 'simulcast' property to pass to janus.js to true
        //simulcast: doSimulcast,
        //simulcast2: doSimulcast2,
        success: function (jsep) {
          Janus.debug("Got SDP!");
          Janus.debug(jsep);
          var publish = { "request": "publish", "audio": false, "video": true };
          echotest.send({ "message": publish, "jsep": jsep });
          if (sendMessageJoin) {
            sendMessage('@@IDSHR@@' + room);
          }
          //echotest.send({"message": body, "jsep": jsep});
        },
        error: function (error) {
          Janus.error("WebRTC error:", error);
          setMensajeError("WebRTC error... " + JSON.stringify(error));
          setError(true);

          enqueueSnackbar(mensajeError, { variant: 'error' });
        }
      });
  }


  useEffect(() => {
    //--------------------------------------------------------------
    // Funciones para compartir archivos
    //--------------------------------------------------------------
    //refFileSelector.current.addEventListener('change', handFileSystem);

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
    Janus.init({
      debug: true,
      dependencies: Janus.useDefaultDependencies(),
      callback: dejarTodoListo
    });
    return () => { // Desmontado del efecto

      if (janusVC) {
        janusVC.destroy();
      }
      //-------------------------
      // Por sharing
      //-------------------------
      if (janusShr) {
        janusShr.destroy();
      }
    };
  }, []); // Solo se ejecuta una sola vez


  //---------------------------------------------------------------------
  // Función callback luego de iniciar janus (Janus.init)
  // Lo unico que se hace es que se activa un flag (janusReady) para que
  // el formulario quede listo para inciar la video conferencia
  //---------------------------------------------------------------------


  function registerUsername(userName) {
    // Try a registration
    if (userName === "") {
    
    }
    if (/[^a-zA-Z0-9]/.test(userName)) {
      
    }
    const register = { "request": "register", "username": userName };
    videocall.send({ "message": register });
  }


  function doHangup() {
    // Hangup a call
    var hangup = { "request": "hangup" };
    videocall.send({ "message": hangup });
    videocall.hangup();
    yourusername = null;
  }

  function resetSharing() {
    setUserSharing(false);
    setUserReciveSharing(false);
    refStream.current.srcObject = null;
    //setJanusSharingReady(false);  
  }

  //--------------------------------------------------------------------
  // Función que permite crear el objeto Janus e iniciar la transmisión
  //--------------------------------------------------------------------
  function dejarTodoListo() {


    if (Janus.isGetUserMediaAvailable()) {
      setBugDialog([...bugDialog, 'Si se dispone de User Media'])
    } else {
      setBugDialog([...bugDialog, 'No se dispone de User Media'])

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
    if (pluginSHReady) {
      setToggleAudio(true);
      setToggleVideo(true);
      refStreamLeft.current.srcObject = null;
      setStreamLeft(false);
      refStreamRight.current.srcObject = null;
      setStreamRight(false);
      setPluginVCReady(false);
      setUserRegistered(false);
      setUserTalking(false);
      setUserCalling(false);
      janusVC.destroy();

      setPassiveState(); //Para sincronizacion de llamadas
      //---------------
      // por sharing
      //---------------
      refStream.current.srcObject = null;
      setUserSharing(false);
      //setSharingReady(false);
      setPluginSHReady(false);
      firstTime = false;
      if (thisUserSharing) {
        clickUnPublish();
        thisUserSharing = false;
      }
      janusShr.destroy();

      return;
      //setJanusReady(false); 
    }

    //-------------------------------------------------------------------------------
    // Creamos el objeto Janus que nos permitirá crear los componentes de VIDEO CALL
    //-------------------------------------------------------------------------------
    janusVC = new Janus( {
      server: server,
      success: function () {
          janusVC.attach({
            plugin: "janus.plugin.videocall",
            opaqueId: opaqueId,
            success: function (pluginHandle){
                videocall = pluginHandle;
                Janus.log("::: JANUS VC - Plugin attached! (" + videocall.getPlugin() + ", id=" + videocall.getId() + ")");
                Janus.listDevices(listDevices);
              },
              error: function (error) {
                console.error(' -- Error attaching plugin...', error);
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
              iceState: function (state) {
                Janus.log("ICE state changed to " + state);
              },
              mediaState: function (medium, on) {
                Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
              },
              webrtcState: function (on) {
                Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                //$("#videoleft").parent().unblock();
              },
              slowLink: function (uplink, lost) {
                Janus.warn("Janus reports problems " + (uplink ? "sending" : "receiving") +
                  " packets on this PeerConnection (" + lost + " lost packets)");
              },
              onmessage: function (msg, jsep) {
                Janus.debug(" ::: Got a message :::");
                Janus.debug(msg);
                console.error(msg)
                var result = msg["result"];
                if (result !== null && result !== undefined) {
                  if (result["list"] !== undefined && result["list"] !== null) {
                    var list = result["list"];
                    Janus.debug("Got a list of registered peers:");
                    Janus.debug(list);
                    for (var mp in list) {
                      Janus.debug("  >> [" + list[mp] + "]");
                    }
                  } else if (result["event"] !== undefined && result["event"] !== null) {
                    var event = result["event"];
                    if (event === 'registered') {
                      myusername = result["username"];
                      Janus.log("Successfully registered as " + myusername + "!");
                      setUserRegistered(true);
                      //Aqui se puede mostrar un mensaje de que fue correctamente registrado
                      //$('#youok').removeClass('hide').show().html("Registered as '" + myusername + "'");
                      // Get a list of available peers, just for fun
                      videocall.send({ "message": { "request": "list" } });

                    } else if (event === 'calling') {
                      Janus.log("Waiting for the peer to answer...");
                      setUserCalling(true);
                      // TODO Any ringtone?
                    } else if (event === 'incomingcall') {
                      Janus.log("Incoming call from " + result["username"] + "!");
                      yourusername = result["username"];
                      // Notify user
                      setOpenCallMessage(true);
                      globalJsep = jsep; //Puesto para exportar variable
                      //bootbox.hideAll();
                      //incoming = bootbox.dialog( );
                    } else if (event === 'accepted') {
                      //bootbox.hideAll();
                      var peer = result["username"];
                      if (peer === null || peer === undefined) {
                        Janus.log("Call started!");
                      } else {
                        Janus.log(peer + " accepted the call!");
                        yourusername = peer;
                      }
                      setUserTalking(true);
                      setUserCalling(false);
                      // Video call can start
                      if (jsep)
                        videocall.handleRemoteJsep({ jsep: jsep });
                      // Aqui se deberia habilitar el boton de colgar
                      //$('#call').removeAttr('disabled').html('Hangup')
                      //  .removeClass("btn-success").addClass("btn-danger")
                      //  .unbind('click').click(doHangup);
                    } else if (event === 'update') {
                      // An 'update' event may be used to provide renegotiation attempts
                      if (jsep) {
                        if (jsep.type === "answer") {
                          videocall.handleRemoteJsep({ jsep: jsep });
                        } else {
                          let configVideo = null;
                          if (Janus.webRTCAdapter.browserDetails.browser === "firefox") {
                            configVideo = true;
                          } else {
                            configVideo = true;
                          }
                          videocall.createAnswer(
                            {
                              jsep: jsep,
                              media: { video: configVideo, data: true },	// Let's negotiate data channels as well
                              success: function (jsep) {
                                Janus.debug("Got SDP!");
                                Janus.debug(jsep);
                                var body = { "request": "set" };
                                videocall.send({ "message": body, "jsep": jsep });
                              },
                              error: function (error) {
                                Janus.error("WebRTC error:", error);
                                setFeedback({
                                  title:'Error al intentar establecer llamada',
                                  body:"Por favor presione continuar y  espere que su asesor lo vuelva a llamar.",
                                  action:'Continuar',
                                  trigger:()=> history.go(0)
                                });                                   }
                            });
                        }
                      }
                    } else if (event === 'hangup') {
                      Janus.log("Call hung up by " + result["username"] + " (" + result["reason"] + ")!");
                   
                      setOpenCallMessage(false);
                     
                      setToggleAudio(true);
                      setToggleVideo(true);
                      refStreamLeft.current.srcObject = null;
                      setStreamLeft(false);
                      refStreamRight.current.srcObject = null;
                      setStreamRight(false);
                      setPassiveState();
                      setUserCallingLocal(false);
                      userCallingLocalTmp = false;
                      //---------------
                      // por sharing
                      //---------------
                      refStream.current.srcObject = null;
                      setUserCalling(false);
                      setUserTalking(false);
                      if (thisUserSharing) {
                        clickUnPublish();
                        thisUserSharing = false;
                      }
                      videocall.hangup();

                    } else if (event === "simulcast") {

                    }
                  }
                } else {
                  // FIXME Error?
                  var error = msg["error"];
                  const error_code = msg.error_code || null
              
                  if (error.indexOf("already taken") > 0) {
                    setFeedback({
                      title:"Nombre duplicado",
                      body:"Por favor verifique que no tenga abierta esta rerunión en otro dispositivo.",
                      action:'Intentar de nuevo',
                      trigger:()=> (history.go(0),videocall.hangup())
                    });
                  }

                  if (error_code === 478) {
                    setFeedback({
                      title:"El cliente no está en la sala.",
                      body:"Por favor indicarle a su cliente que entre y vuelva a intentar",
                      action:'Intentar de nuevo',
                      trigger:()=> (history.go(0),videocall.hangup())
                    });
                  }
                 
                }
              },
              onlocalstream: function (stream) {


                //::: why this ??
                if (!userCallingLocalTmp) {
                  Janus.debug(" ::: Got a local stream :::");
                  Janus.debug(stream);
                  setStreamLeft(true);
                  refStreamLeft.current.srcObject = stream;
                }

                //::: Removing condition..
                setStreamLeft(true);
                refStreamLeft.current.srcObject = stream;
                //----------------------------------------------------------
                // Lo siguiente es si el usuario puso en mute audio o video
                //----------------------------------------------------------

                !enableAudioTmp && videocall.muteAudio();
                !enableVideoTmp && videocall.muteVideo();


                setStreamLeft(true);
                //$("#myvideo").get(0).muted = "muted";
                if (videocall.webrtcStuff.pc.iceConnectionState !== "completed" &&
                  videocall.webrtcStuff.pc.iceConnectionState !== "connected") {
                  // AQUI se debe mostrar un spiner miestas se carga el video de la derecha
                }

                var videoTracks = stream.getVideoTracks();
                if (videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
                  // No webcam
                  // No se si mostrar un mensaje que no tiene webcam el dispositovo
                } else {
                  // Aquo no se debe hacer nada
                }
              },
              onremotestream: function (stream) {
                Janus.debug(" ::: Got a remote stream :::");
                Janus.debug(stream);
                // Show the video, hide the spinner and show the resolution when we get a playing event
                var videoTracks = stream.getVideoTracks();
                if (videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
                  // No remote video
                  // Aqui hay que mostrar algun mensaje de error creo
                  setStreamRight(false);
                  setReceivingVideo(false);
                } else {
                  refStreamRight.current.srcObject = stream;
                  setStreamRight(true);
                  setUserTalking(true);
                  console.log('seteo a true StreamRight');
                  setReceivingVideo(true);
                  goSetAudioOutput(refStreamRight, idDeviceOutputAudioTmp);
                }
              },
              ondataopen: function (data) {
                //Aqui hay que deshabilitar el data send
                Janus.log("The DataChannel is available!");
              },
              ondata: function (data) {
                // aqui poner el setState para mandar el mensaje
                Janus.debug("We got data from the DataChannel! " + data);
                let posHastack = data.indexOf('@@IDSHR@@');
                let data2 = data;
                if (posHastack >= 0) {
                  data2 = data.substr(posHastack + 9);
                  room = data2;
                  joinScreen(data2);
                } else {
                  setDataRecive(data2);
                }
              },
              oncleanup: function () {
                
                Janus.log(" ::: Got a cleanup notification :::");
                console.log('Dentro de onCleanup');
                // setFeedback({
                //   title:'La llamada ha finalizado',
                //   body:"Por alguna razón la llamada ha finalizado.",
                //   action:'Volver a ingresar.',
                //   trigger:()=>{
                //     setFeedback(null)
                //     setTranslate(0)
                //   }
                // });
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
    setPluginVCReady(true);

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
       
          setMensajeError("Error 2:" + error);
          setError(true);
        },
        destroyed: function () {
          //window.location.reload();
        }
      });

    setPluginSHReady(true);
  }

  function newLocalFeed() {
    // Attach to VideoRoom plugin
    janusShr.attach(
      {
        plugin: "janus.plugin.videoroom",
        opaqueId: opaqueId,
        success: function (pluginHandle) {
          screentest = pluginHandle;
          Janus.log("Plugin attached! (" + screentest.getPlugin() + ", id=" + screentest.getId() + ")");
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
          if (on) {
            sendMessage('@@IDSHR@@' + room);
          } else {
           
            setFeedback({
              title:"Se dejó de compartir pantalla.",
              body:"Uno de los participantes ha abandonado la sala.",
              action:'Entendido',
              trigger:()=>setFeedback(null)
            });

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
              myid = msg["id"];
              idPublisher = msg["id"];
              //$('#session').html(room);
              //setIdSession(room);
              Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);
              if (role === "publisher") {
                // This is our session, publish our stream
                Janus.debug("Negotiating WebRTC stream for our screen (capture " + capture + ")");

                if (isMobile || isPdf) {
                  sendFileCanvas(screentest, false);
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
                      },
                      error: function (error) {
                        Janus.error("WebRTC error:", error);
                        setMensajeError("WebRTC error... " + JSON.stringify(error));
                        setError(true);
                      }
                    });
                }
              } else {
                // We're just watching a session, any feed to attach to?
                if (msg["publishers"] !== undefined && msg["publishers"] !== null) {
                  var list = msg["publishers"];
                  Janus.debug("Got a list of available publishers/feeds:");
                  Janus.debug(list);
                  for (var f in list) {
                    var id = list[f]["id"];
                    //idPublisher = id;
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
                  setFeedback({
                    title:"Se dejó de compartir pantalla.",
                    body:"La persona que estaba compartiendo ha abandonado la sala",
                    action:'Entendido',
                    trigger:()=>setFeedback(null)
                  });
                  resetSharing();
                  //window.location.reload();
                }
              } else if (msg["unpublished"] !== undefined && msg["unpublished"] !== null) {
                //clickUnPublish();
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
          setUserSharing(false);
          //setSharingReady(false);
        }
      });
  }

  //----------------------------------------
  // Funciones utilizadas en elementos html
  //----------------------------------------
  function clickToggleAudio() {
    const newVal = !toggleAudio;
    enableAudioTmp = newVal;
    setToggleAudio(newVal);
    if (userTalking) {
      if (newVal) {
        videocall.unmuteAudio();
      } else {
        videocall.muteAudio();
      }
    }
    Janus.log((newVal ? "Unmuting Audio" : "Muting Audio") + " local stream...");
  }

  function clickToggleVideo() {
    const newVal = !toggleVideo;
    enableVideoTmp = newVal;
    setToggleVideo(newVal);
    if (userTalking) {
      if (newVal) {
        videocall.unmuteVideo();
      } else {
        videocall.muteVideo();
      }
    }
    Janus.log((newVal ? "Unmuting Video" : "Muting Video") + " local stream...");
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
        success: function () { },
      });
    }
  }

  //-----------------------------------------------------
  // Funciones para SHARING
  //-----------------------------------------------------
  function newRemoteFeed(id, display) {
    // A new feed has been published, create a new plugin handle and attach to it as a listener
    source = id;
    //var remoteFeed = null;
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
              Janus.log("Successfully attached to feed " + id + " (" + display + ") in room " + msg["room"]);
            } else {
              // What has just happened?
            }
          }
          if (jsep !== undefined && jsep !== null) {
            Janus.debug("Handling SDP as well...");
            Janus.debug(jsep);
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
                  setMensajeError("WebRTC error... " + error);
                  setError(true);
                }
              });
          }
        },
        onlocalstream: function (stream) {
          // The subscriber stream is recvonly, we don't expect anything here
        },
        onremotestream: function (stream) {
          console.log('inicio a mostrar el video 2');
          refStream.current.srcObject = stream;
          //setSharingReady(false);
          setUserReciveSharing(true);
        },
        oncleanup: function () {
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

  function shareScreen(titleShared) {
    if (!Janus.isExtensionEnabled()) {
      alert("You're using Chrome but don't have the screensharing extension installed: click <b><a href='https://chrome.google.com/webstore/detail/janus-webrtc-screensharin/hapfgfdkleiggjjpfpenajgdnfckjpaj' target='_blank'>here</a></b> to do so");
      //, function() {
      //  window.location.reload();
      //});
      return;
    }

    capture = "screen";
    role = "publisher";
    //firstTime = true;
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
            myusername = randomString(12);
            //idPublisher = randomString(9);
            var register = { "request": "join", "room": room, "ptype": "publisher", "display": myusername };
            screentest.send({ "message": register });
          }
        }
      });
      firstTime = false;
    } else {
      if (isMobile || isPdf) {
        sendFileCanvas(screentest, false);
      } else {
        screentest.createOffer(
          {
            media: { video: capture, audioSend: false, videoRecv: false },	// Screen sharing Publishers are sendonly
            success: function (jsep) {
              globalSharingJsep = jsep;
              Janus.debug("Got publisher SDP!");
              Janus.debug(jsep);
              //var publish = { "request": "configure", "audio": false, "video": true };
              console.log("desde ShareScreen: voy a hacerlo como publish nada mas");
              var publish = { "request": "publish", "audio": false, "video": true };
              screentest.send({ "message": publish, "jsep": jsep });
              //sendMessage('@@IDRESHR@@' + idPublisher);
              sendMessage('@@IDSHR@@' + room);
            },
            error: function (error) {
              Janus.error("WebRTC error:", error);
              setMensajeError("WebRTC error... " + JSON.stringify(error));
              setError(true);
            }
          });
      }
    }
  }


  function joinScreen(roomId) {
    if (isEdgeChromium) {
      alert("Se mostrara información en su pantalla");
    }
    // Join an existing screen sharing session
    firstTime = false;
    room = parseInt(roomId);
    role = "listener";
    myusername = randomString(12);
    var register = { "request": "join", "room": room, "ptype": "publisher", "display": myusername };
    screentest.send({ "message": register });
    console.log("desde JoinScreen: realice el Join");
  }

  function clickUnPublish() {
    var register = { "request": "unpublish" };
    screentest.send({ "message": register });
    

    refFileSelector.current.value = "";//Resets the file name of the file input - See #2

    resetSharing();

  }



  function gotStream(stream) {
    gobalStreamLocal = stream;
    window.stream = stream; // make stream available to console
    refStreamLeft.current.srcObject = stream;
    //refStreamLeft.current.play();
    //refStreamLeft.current.addEventListener('play', function () {
    //  doRenderLocalVideo();
    //}, 0); 

    // Capture the canvas as a local MediaStream
    let canvas = refCanvasVideoLocal.current;
    canvasStreamLocalCall = canvas.captureStream();
    canvasStreamLocalCall.addTrack(stream.getAudioTracks()[0]);

  }

  function handleErrorTmp(error) {
    console.error('Error change device: ', error);
  }

  function goSetAudioOutput(refStream, valueAudioOut) {
    if (typeof refStream.current.setSinkId == 'function') { ////ocurre en safary y firefox que no existe esta funcion
      refStream.current.setSinkId(valueAudioOut);
    }
    idDeviceOutputAudio = valueAudioOut;
  }

  function doRenderLocalVideo() {
    let video = refStreamLeft.current;
    let canvasStream = refCanvasVideoLocal.current;
    let context = canvasStream.getContext('2d');


    (function loop() {
      const fps = 15;
      if (!video.paused && !video.ended) {
        context.clearRect(0, 0, canvasStream.width, canvasStream.height);
        context.drawImage(video, 0, 0, canvasStream.width, canvasStream.height);

        setTimeout(loop, 1000 / fps);
      }
    })();
  }

  function doTakeSnapshot(canvas, image, video) {
    setScreenShotStatus(true)
    // let canvas = refCanvasTakeSnapshot.current;
    // let image = refImgTakeSnapshot.current;
    // let video = refStreamRight.current;


    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    // Other browsers will fall back to image/png
    //img.src = canvas.toDataURL("image/webp");
    image.src = canvas.toDataURL("image/webp");

    setDisplaySnapshot(true)

  }

  function doTakeSnapshot2() {
    let canvas = refCanvas2TakeSnapshot.current;
    let image = refImg2TakeSnapshot.current;
    let video = refStream.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    // Other browsers will fall back to image/png
    //img.src = canvas.toDataURL("image/webp");
    image.src = canvas.toDataURL("image/webp");
  }




  const stream_a = "https://player.vimeo.com/external/365690312.sd.mp4?s=57a3fefbb2dbe7a68f6066bf1f896540170819bc&profile_id=139&oauth2_token_id=57447761";


  return (
    <div>




    <Feedback feedback={feedback} setFeedback={setFeedback}/>

      <RenderShare
        muted={true}
        stream={refStream}
        hasLogo={false}
        hidden={!userReciveSharing}
        onClose={() => clickUnPublish()}
        isPdf={userSelectPDF}
      />



      <View>
        <MainSide>
          <RenderVideo hidden={!receivingVideo} muted={false} stream={refStreamRight} hasLogo={true} />
        </MainSide>
        <SecondarySide>
          <RenderVideo muted={true} stream={refStreamLeft} hasLogo={false} />
        </SecondarySide>
      </View>



      {/** FEATURE_FILE_SHARING */}
      <CustomModal hide={!(userSelectPDF && userSharing)}
        onClose={() => clickUnPublish()}
      >


        <>



          <div hidden={true}>
            <input type="file" onChange={handFileSystem} ref={refFileSelector} />
          </div>
          <div hidden={true}>
            <Document file={urlNamePdf} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} className={classes.pdf} canvasRef={refCanvasPage} onRenderSuccess={onRenderPage} />
            </Document>
          </div>

        </>




        <div hidden={!(userSelectPDF && userSharing)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position:'relative' }}>
          <div hidden={!((isMobile || isPdf) && userSharing)}>
            <canvas ref={refCanvasStream}></canvas>
          </div>

        
          <div style={{display:'flex', justifyContent:'space-between', postion:'absolute', width:'90%', top:'25vh', position:'absolute'}}>
            <IconButton onClick={goToPrevPage} >
              <ChevronLeft/>
            </IconButton>
            <IconButton onClick={goToNextPage} >
              <ChevronRight/>
            </IconButton>
          
          </div>

        </div>

      </CustomModal>






      <DebugDialog data={bugDialog} />








      <CardButtonList translate={translate} setTranslate={setTranslate} style={{ display: userCalling || userTalking ? 'none' : '' }} >


        <Controls
          //:: CALL SETTINGS
          lockDevices={userCalling || userTalking}
          callSettingsDialog={callSettingsDialog}
          setCallSettingsDialog={setCallSettingsDialog}
          runSettings={() => runSettings()}



          //ACTION_VIDEO_TOGGLE
          videoDisabled={userCalling}
          videoToggle={toggleVideo}
          videoCb={() => clickToggleVideo()}

          //ACTION_AUDIO_TOGGLE
          micDisabled={userCalling}
          micToggle={toggleAudio}
          micCb={() => clickToggleAudio()}

          //ACTION COLGAR
          hangUpCb={() => doHangup()}
          hangUpDisabled={(!userCalling && !userTalking) || !userRegistered}


          //ACTION_SCREEN_SHARING
          sharingDisabled={!pluginSHReady}
          sharingHidden={!userTalking || userReciveSharing || userSharing || isMobile}
          sharingCb={() => shareScreen(Janus.randomString(12))}
          stopSharingHidden={!userSharing || userReciveSharing}
          stopSharingCb={() => clickUnPublish()}

          //ACTION OPEN MENU
          menu={translate}
          menuCb={() => setTranslate(translate === 0 ? 81 : 0)}



          //PDF SHARING
          onSharePdf={doSelectFileToDisck}


          deviceInputAudio={deviceInputAudio}
          deviceOutputAudio={deviceOutputAudio}
          deviceInputVideo={deviceInputVideo}

        />







        {
          logged ?
            <CardButton art={callAsset} disabled={userCalling || userTalking} onClick={() => setCallSettingsDialog({ dialog: true, callReady: true })}>
              Llamar a mi cliente.
           </CardButton>

            :
            <CardButton art={callAsset} >
              Hola, su reunión inicia: {dateText}. Por favor espere que su asesor le llame.
            </CardButton>
        }


        <CardButton art={uploadAsset} disabled={false} onClick={autoservicioCb}>
          Subir documentos.
        </CardButton>



        <CardButton art={helpAsset} onClick={()=>{}}>
          Necesito ayuda.
        </CardButton>




      </CardButtonList>




      <div hidden={!(streamLeft && userCallingLocal)} style={{ display: 'none' }}>
        <canvas ref={refCanvasVideoLocal}></canvas>
      </div>



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



  );

}



export default VideoCallSharingTest;







