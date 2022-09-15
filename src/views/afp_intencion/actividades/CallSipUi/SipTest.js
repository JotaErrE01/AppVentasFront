/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-else-return */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { useEffect, useState, useRef } from 'react'
import { TextField, IconButton, Typography, Box, Button } from '@material-ui/core';
import { PhoneRounded, CallEndRounded } from '@material-ui/icons';
import { palette } from 'src/theme';
import SipAvatar from 'src/views/afp_intencion/actividades/CallSipUi/SipAvatar';
import useAuth from 'src/contextapi/hooks/useAuth';
import { setInitialized } from 'src/slices/janus';
import { useDispatch, useSelector } from 'src/store';
import Alert from '@material-ui/lab/Alert';
import styled from 'styled-components';


//--------------------------------------------------------------
// Janus Gateway: Variables globales para acceso de renderizado
//--------------------------------------------------------------

let janus = null;
let sipcall = null;
// var OPAQUE_ID = "siptest-"+Janus.randomString(12);

let selectedApproach = null;
let masterId = null, helpers = {}, helpersCount = 0;
let referId = null;
let offerlessInvite = false;
let globalJsep = null;

let idDeviceInputAudio = null;
let idDeviceOutputAudio = null;
let idDeviceInputVideo = null;

let deviceInputAudio = [];
let deviceInputVideo = [];
let deviceOutputAudio = [];

let enableAudioTmp = true;




function SipTest({
    callSettings,
    onTouch,
    setCurrentCall,
    currentCall,
    phoneNumber,
    phoneLabel
}) {

    const dispatch = useDispatch();
    const { user } = useAuth();

    //:: VAR JANUS
    var Janus = window.Janus;
    const OPAQUE_ID = "siptest-" + Janus.randomString(12);


    ///:: JANUS 
    const [pluginReady, setPluginReady] = useState(false);
    const [toggleAudio, setToggleAudio] = useState(true);
    const [userRegistered, setUserRegistered] = useState(false);
    const [userTalking, setUserTalking] = useState(false);
    const [userNumberCall, setUserNumberCall] = useState('');

    const [error, setError] = useState(false);
    const [userCalling, setUserCalling] = useState(false);
    const [openCallMessage, setOpenCallMessage] = useState(false);
    const [messageCalling, setMessageCalling] = useState(false);
    const refStream = useRef(null);

    const [showPanel, setshowPanel] = useState(true);

    useEffect(() => {
        const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
        Janus.init({
            debug: true,
            dependencies: Janus.useDefaultDependencies(),
            callback: didInit
        });
    }, []);


    const didDestroy = () => {
        janus.destroy();

    }

    const didInit = () => {
        Janus.isGetUserMediaAvailable() ? console.log('Si se dispone de User Media') : console.log('No se dispone de User Media');
        !Janus.isWebrtcSupported() ? console.log('WebRTC no esta soportado por su dispositivo') : console.log('WebRTC si esta soportado por su dispositivo');


        //-----------------------------------------------------------------
        // Creamos el objeto Janus que nos permitirá crear los componentes
        //-----------------------------------------------------------------
        janus = new Janus(
            {
                server: callSettings.server,
                success: function () {

                    janus.attach(
                        {
                            plugin: "janus.plugin.sip",
                            OPAQUE_ID: OPAQUE_ID,
                            success: function (pluginHandle) {
                                sipcall = pluginHandle;
                                Janus.log("Plugin attached! (" + sipcall.getPlugin() + ", id=" + sipcall.getId() + ")");
                                Janus.listDevices(initDevices);

                                setCurrentCall({
                                    plugin: sipcall.getPlugin(),
                                    sipId: sipcall.getId()
                                })
                                // Prepare the username registration
                                // Prepare the username registration
                                // Si el registro será interactivo aqui se debe habilitar los campos de entrada
                            },
                            error: function (error) {

                                Janus.error("  -- Error attaching plugin...", error);
                            },
                            consentDialog: function (on) {

                                Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
                                if (on) {

                                } else {

                                }
                            },
                            iceState: function (state) {

                                Janus.log("ICE state changed to " + state);
                            },
                            mediaState: function (medium, on) {

                                Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
                                on && (medium == 'audio') && setCurrentCall({ status: 'beep' })
                            },
                            webrtcState: function (on) {

                                Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                                // No usaremos video en este demo
                            },
                            onmessage: function (msg, jsep) {
                                Janus.debug(" ::: Got a message :::", msg);
                                if (msg && msg.result && msg.result.code === 603) {
                                    setCurrentCall({ status: 'central_fail' })
                                }

                                if (msg && msg.result && msg.result.event === "registered") {


                                    dispatch(setInitialized(true))
                                }
                                // Any error?
                                var error = msg["error"];
                                if (error) {
                                    if (!userRegistered) {
                                        //Si es interactivo volver a mostrar los campos de conexión SIP
                                    } else {
                                        // Reset status
                                        sipcall.hangup();
                                        //Si es interactivo mostrar o habilirar los campos para hacer la llamada telefónica
                                    }
                                    //error);
                                    return;
                                }
                                var callId = msg["call_id"];
                                var result = msg["result"];
                                if (result && result["event"]) {
                                    var event = result["event"];
                                    if (event === 'registration_failed') {
                                        Janus.warn("Registration failed: " + result["code"] + " " + result["reason"]);
                                        //Si es interactivo volver a mostrar los campos de conexión SIP
                                        alert(result["code"] + " " + result["reason"]);
                                        return;
                                    }
                                    if (event === 'registered') {
                                        Janus.log("Successfully registered as " + result["username"] + "!");
                                        //Si es interactivo esconder o inhabilitar los campos de conexión SIP y
                                        // habilitar los campos para la llamada
                                        if (!userRegistered) {
                                            masterId = result["master_id"];
                                            setUserRegistered(true);


                                        }
                                    } else if (event === 'calling') {
                                        Janus.log("Waiting for the peer to answer...");
                                        // TODO Any ringtone?
                                        setUserCalling(true);
                                    } else if (event === 'incomingcall') {
                                        Janus.log("Incoming call from " + result["username"] + "!");
                                        sipcall.callId = callId;
                                        var doAudio = true, doVideo = false; //doVideo = true
                                        //var offerlessInvite  // Se la puso como variable global
                                        globalJsep = jsep; //se lo coloca en una variable global
                                        if (jsep) {
                                            // What has been negotiated?
                                            doAudio = (jsep.sdp.indexOf("m=audio ") > -1);
                                            doVideo = (jsep.sdp.indexOf("m=video ") > -1);
                                            Janus.debug("Audio " + (doAudio ? "has" : "has NOT") + " been negotiated");
                                            Janus.debug("Video " + (doVideo ? "has" : "has NOT") + " been negotiated");
                                        } else {
                                            Janus.log("This call doesn't contain an offer... we'll need to provide one ourselves");
                                            offerlessInvite = true;
                                            // In case you want to offer video when reacting to an offerless call, set this to true
                                            doVideo = false;
                                        }
                                        // Is this the result of a transfer?
                                        var transfer = "";
                                        var referredBy = result["referred_by"];
                                        if (referredBy) {
                                            transfer = " (referred by " + referredBy + ")";
                                            transfer = transfer.replace(new RegExp('<', 'g'), '&lt');
                                            transfer = transfer.replace(new RegExp('>', 'g'), '&gt');
                                        }
                                        // Any security offered? A missing "srtp" attribute means plain RTP
                                        var rtpType = "";
                                        var srtp = result["srtp"];
                                        if (srtp === "sdes_optional")
                                            rtpType = " (SDES-SRTP offered)";
                                        else if (srtp === "sdes_mandatory")
                                            rtpType = " (SDES-SRTP mandatory)";
                                        //bootbox.hideAll();
                                        var extra = "";
                                        if (offerlessInvite)
                                            extra = " (no SDP offer provided)"

                                        setMessageCalling("Llamada entrante " + result["username"] + "!" + transfer + rtpType + extra);
                                        setOpenCallMessage(true);

                                    } else if (event === 'accepting') {
                                        // Response to an offerless INVITE, let's wait for an 'accepted'
                                    } else if (event === 'progress') {
                                        Janus.log("There's early media from " + result["username"] + ", wairing for the call!", jsep);
                                        // Call can start already: handle the remote answer
                                        if (jsep) {
                                            sipcall.handleRemoteJsep({ jsep: jsep, error: doHangup });
                                        }
                                        //IMPLEMENTAR toastr.info("Early media...");
                                    } else if (event === 'accepted') {
                                        Janus.log(result["username"] + " accepted the call!", jsep);
                                        setCurrentCall({ status: 'accepted' });

                                        // Call can start, now: handle the remote answer
                                        if (jsep) {
                                            sipcall.handleRemoteJsep({ jsep: jsep, error: doHangup });
                                        }
                                        //IMPLEMENTAR toastr.success("Call accepted!");
                                        setUserCalling(false);
                                        setUserTalking(true);
                                        if (!enableAudioTmp) {
                                            changeAudio(enableAudioTmp); //Seteos iniciales de usuario
                                        }
                                        sipcall.callId = callId;
                                    } else if (event === 'updatingcall') {
                                        // We got a re-INVITE: while we may prompt the user (e.g.,
                                        // to notify about media changes), to keep things simple
                                        // we just accept the update and send an answer right away
                                        Janus.log("Got re-INVITE");
                                        var doAudio = (jsep.sdp.indexOf("m=audio ") > -1),
                                            doVideo = (jsep.sdp.indexOf("m=video ") > -1);
                                        sipcall.createAnswer(
                                            {
                                                jsep: jsep,
                                                media: { audio: doAudio, video: doVideo },
                                                success: function (jsep) {
                                                    Janus.debug("Got SDP " + jsep.type + "! audio=" + doAudio + ", video=" + doVideo + ":", jsep);
                                                    var body = { request: "update" };
                                                    sipcall.send({ message: body, jsep: jsep });
                                                },
                                                error: function (error) {
                                                    Janus.error("WebRTC error:", error);
                                                    alert("WebRTC error... " + error.message);
                                                }
                                            });
                                    } else if (event === 'message') {
                                        // We got a MESSAGE
                                        var sender = result["displayname"] ? result["displayname"] : result["sender"];
                                        var content = result["content"];
                                        content = content.replace(new RegExp('<', 'g'), '&lt');
                                        content = content.replace(new RegExp('>', 'g'), '&gt');
                                        //IMPLEMENTAR toastr.success(content, "Message from " + sender);
                                    } else if (event === 'info') {
                                        // We got an INFO
                                        var sender = result["displayname"] ? result["displayname"] : result["sender"];
                                        var content = result["content"];
                                        content = content.replace(new RegExp('<', 'g'), '&lt');
                                        content = content.replace(new RegExp('>', 'g'), '&gt');
                                        //IMPLEMENTAR toastr.info(content, "Info from " + sender);
                                    } else if (event === 'notify') {
                                        // We got a NOTIFY
                                        var notify = result["notify"];
                                        var content = result["content"];
                                        //IMPLEMENTAR toastr.info(content, "Notify (" + notify + ")");
                                    } else if (event === 'transfer') {
                                        // We're being asked to transfer the call, ask the user what to do
                                        // IMPORTANTE: Esto no se implemento, para este caso no es necesario

                                    } else if (event === 'hangup') {
                                        setCurrentCall({ status: 'ended' });

                                        sipcall.hangup();
                                        setUserCalling(false);
                                        setUserTalking(false);
                                    } else {
                                        console.log("MIRA LOG " + event);
                                    }
                                }
                            },
                            onlocalstream: function (stream) {
                                //IMPORTATE: No implementado no es necesario
                            },
                            onremotestream: function (stream) {

                                Janus.debug(" ::: Got a remote stream :::", stream);
                                refStream.current.srcObject = stream;
                                var videoTracks = stream.getVideoTracks();
                            },
                            oncleanup: function () {

                                Janus.log(" ::: Got a cleanup notification :::");
                                if (sipcall) sipcall.callId = null;
                            }
                        });
                },
                error: function (error) {

                    alert("Hubo un problema para conectar con la central telefónica, no podrá hacer llamadas")
                    dispatch(setInitialized(false))
                },
                destroyed: function () {

                    window.location.reload();
                }
            });

        setPluginReady(true);
    }











    //--------------------------------------------------------------------
    // Función que permite obtener un arreglo de los devices del equipo
    //--------------------------------------------------------------------
    function initDevices(devices) {
        devices.forEach(function (device) {
            var label = device.label;
            if (!label || label === "")
                label = device.deviceId;
            //var option = $('<option value="' + device.deviceId + '">' + label + '</option>');
            if (device.kind === 'audioinput') {
                //alert('recuerso ' + label);
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
        //if(Janus.webRTCAdapter.browserDetails.browser === "safari" || Janus.webRTCAdapter.browserDetails.browser === "firefox"){  //Safari y firefox no permite el uso de esto
        //  deviceOutputAudio.push({id: "default", viewValue: "Defaul Speaker"});
        //}

        idDeviceInputAudio = deviceInputAudio[0].id;
        idDeviceOutputAudio = deviceOutputAudio[0].id;
        idDeviceInputVideo = deviceInputVideo[0].id;


        registerUsername()

    }





    //---------------------------------------------------------------------
    // Función callback luego de iniciar janus (Janus.init)
    // Lo unico que se hace es que se activa un flag (janusReady) para que
    // el formulario quede listo para inciar la video conferencia
    //---------------------------------------------------------------------

    const handleHangUpCall = () => {
        var body = { request: "decline" };
        sipcall.send({ message: body });
        setOpenCallMessage(false);
    };

    const handleAnswerCall = () => {
        let doAudio = true;
        let doVideo = false; //doVideo = true

        //$('#peer').val(result["username"]).attr('disabled', true);
        // Notice that we can only answer if we got an offer: if this was
        // an offerless call, we'll need to create an offer ourselves
        let jsep = globalJsep;
        var sipcallAction = (offerlessInvite ? sipcall.createOffer : sipcall.createAnswer);
        sipcallAction(
            {
                jsep: jsep,
                media: { audio: doAudio, video: doVideo },
                success: function (jsep) {
                    Janus.debug("Got SDP " + jsep.type + "! audio = true, video = false :", jsep);
                    var body = { request: "accept" };
                    // Note: as with "call", you can add a "srtp" attribute to
                    // negotiate/mandate SDES support for this incoming call.
                    // The default behaviour is to automatically use it if
                    // the caller negotiated it, but you may choose to require
                    // SDES support by setting "srtp" to "sdes_mandatory", e.g.:
                    //		var body = { request: "accept", srtp: "sdes_mandatory" };
                    // This way you'll tell the plugin to accept the call, but ONLY
                    // if SDES is available, and you don't want plain RTP. If it
                    // is not available, you'll get an error (452) back. You can
                    // also specify the SRTP profile to negotiate by setting the
                    // "srtp_profile" property accordingly (the default if not
                    // set in the request is "AES_CM_128_HMAC_SHA1_80")
                    // Note 2: by default, the SIP plugin auto-answers incoming
                    // re-INVITEs, without involving the browser/client: this is
                    // for backwards compatibility with older Janus clients that
                    // may not be able to handle them. If you want to receive
                    // re-INVITES to handle them yourself, specify it here, e.g.:
                    //		body["autoaccept_reinvites"] = false;
                    sipcall.send({ message: body, jsep: jsep });
                    console.log("luego de contestar");
                    //$('#call').removeAttr('disabled').html('Hangup')
                    //  .removeClass("btn-success").addClass("btn-danger")
                    //  .unbind('click').click(doHangup);
                },
                error: function (error) {
                    Janus.error("WebRTC error:", error);
                    alert("WebRTC error... " + error.message);
                    // Don't keep the caller waiting any longer, but use a 480 instead of the default 486 to clarify the cause
                    var body = { request: "decline", code: 480 };
                    sipcall.send({ message: body });
                }
            });
        setOpenCallMessage(false);
    };

    function transferCall(numerToTransfer) {
        // Start a blind transfer
        var address = "sip:" + numerToTransfer + "@" + callSettings.central;
        var msg = { request: "transfer", uri: address };
        sipcall.send({ message: msg });
    }

    function registerUsername() {
        if (userRegistered) {
            unRegisterUsername();
            return;
        }
        // Try a registration
        // Let's see if the user provided a server address
        // 		NOTE WELL! Even though the attribute we set in the request is called "proxy",
        //		this is actually the _registrar_. If you want to set an outbound proxy (for this
        //		REGISTER request and for all INVITEs that will follow), you'll need to set the
        //		"outbound_proxy" property in the request instead. The two are of course not
        //		mutually exclusive. If you set neither, the domain part of the user identity
        //		will be used as the target of the REGISTER request the plugin might send.

        var sipserver = "sip:" + callSettings.central;

        selectedApproach = "secret";
        var username = "sip:" + callSettings.phone + "@" + callSettings.central;
        var password = callSettings.pass;
        if (password === "") {
            alert("Insert the username secret (e.g., mypassword)");
            return;
        }
        var register = {
            request: "register",
            username: username
        };
        // By default, the SIP plugin tries to extract the username part from the SIP
        // identity to register; if the username is different, you can provide it here
        var authuser = callSettings.phone;
        if (authuser !== "") {
            register.authuser = authuser;
        }
        // The display name is only needed when you want a friendly name to appear when you call someone
        var displayname = callSettings.name;
        if (displayname !== "") {
            register.display_name = displayname;
        }
        if (selectedApproach === "secret") {
            // Use the plain secret
            register["secret"] = password;
        } else if (selectedApproach === "ha1secret") {
            var sip_user = username.substring(4, username.indexOf('@'));    /* skip sip: */
            var sip_domain = username.substring(username.indexOf('@') + 1);
            register["ha1_secret"] = md5(sip_user + ':' + sip_domain + ':' + password);
        }
        // Should you want the SIP stack to add some custom headers to the
        // REGISTER, you can do so by adding an additional "headers" object,
        // containing each of the headers as key-value, e.g.:
        //		register["headers"] = {
        //			"My-Header": "value",
        //			"AnotherHeader": "another string"
        //		};
        // Similarly, a "contact_params" object will allow you to
        // inject custom Contact URI params, e.g.:
        //		register["contact_params"] = {
        //			"pn-provider": "acme",
        //			"pn-param": "acme-param",
        //			"pn-prid": "ZTY4ZDJlMzODE1NmUgKi0K"
        //		};

        register["proxy"] = sipserver;
        // Uncomment this if you want to see an outbound proxy too
        //register["outbound_proxy"] = sipserver;
        console.log(register);
        sipcall.send({ message: register });
    }

    function unRegisterUsername() {
        console.log('unregister');
        sipcall.send({ message: { request: "unregister" } });
        setUserRegistered(false);
    }

    function clickKeyBoard(cKey) {
        if (userTalking) {
            if (cKey === '<') {
                if (userNumberCall.length > 0) {
                    setUserNumberCall(userNumberCall.substring(0, userNumberCall.length - 1));
                }
            } else {
                // Send DTMF tone (inband)
                sipcall.dtmf({ dtmf: { tones: cKey } });
                setUserNumberCall(userNumberCall + cKey);
                // Notice you can also send DTMF tones using SIP INFO
                // sipcall.send({ message: { request: "dtmf_info", digit: $(this).text() }});
            }
        } else {
            if (cKey !== '*' && cKey !== '#' && cKey !== '<') {
                setUserNumberCall(userNumberCall + cKey);
            } else if (cKey === '<') {
                if (userNumberCall.length > 0) {
                    setUserNumberCall(userNumberCall.substring(0, userNumberCall.length - 1));
                }
            }
        }
    }

    function doCall(numberCall) {

        setshowPanel(false);
        setCurrentCall({ phone: numberCall, status: "calling" });
        let helperId = parseInt(helperId);
        var handle = helperId ? helpers[helperId].sipcall : sipcall;
        var prefix = helperId ? ("[Helper #" + helperId + "]") : "";
        var suffix = helperId ? ("" + helperId) : "";

        var username = "sip:" + callSettings.phone + "@" + callSettings.central;

        // Call this URI
        let doVideo = false;
        Janus && Janus.log && Janus.log(prefix + "This is a SIP " + (doVideo ? "video" : "audio") + " call (dovideo=" + doVideo + ")");
        actuallyDoCall(handle, 'sip:' + numberCall + '@' + callSettings.central, doVideo);
    }

    function actuallyDoCall(handle, uri, doVideo, referId) {
        handle.createOffer(
            {
                media: {
                    audioSend: true, audioRecv: true,		// We DO want audio
                    videoSend: doVideo, videoRecv: doVideo	// We MAY want video
                },
                success: function (jsep) {
                    Janus.debug("Got SDP!", jsep);
                    // By default, you only pass the SIP URI to call as an
                    // argument to a "call" request. Should you want the
                    // SIP stack to add some custom headers to the INVITE,
                    // you can do so by adding an additional "headers" object,
                    // containing each of the headers as key-value, e.g.:
                    //		var body = { request: "call", uri: $('#peer').val(),
                    //			headers: {
                    //				"My-Header": "value",
                    //				"AnotherHeader": "another string"
                    //			}
                    //		};
                    var body = { request: "call", uri: uri };
                    // Note: you can also ask the plugin to negotiate SDES-SRTP, instead of the
                    // default plain RTP, by adding a "srtp" attribute to the request. Valid
                    // values are "sdes_optional" and "sdes_mandatory", e.g.:
                    //		var body = { request: "call", uri: $('#peer').val(), srtp: "sdes_optional" };
                    // "sdes_optional" will negotiate RTP/AVP and add a crypto line,
                    // "sdes_mandatory" will set the protocol to RTP/SAVP instead.
                    // Just beware that some endpoints will NOT accept an INVITE
                    // with a crypto line in it if the protocol is not RTP/SAVP,
                    // so if you want SDES use "sdes_optional" with care.
                    // Note 2: by default, the SIP plugin auto-answers incoming
                    // re-INVITEs, without involving the browser/client: this is
                    // for backwards compatibility with older Janus clients that
                    // may not be able to handle them. If you want to receive
                    // re-INVITES to handle them yourself, specify it here, e.g.:
                    //		body["autoaccept_reinvites"] = false;
                    if (referId) {
                        // In case we're originating this call because of a call
                        // transfer, we need to provide the internal reference ID
                        body["refer_id"] = referId;
                    }
                    handle.send({ message: body, jsep: jsep });
                },
                error: function (error) {
                    Janus.error(prefix + "WebRTC error...", error);
                    alert("WebRTC error... " + error.message);
                }
            });
    }

    function doHangup() {
        // Hangup a call (on the main session or one of the helpers)
        //var button = ev ? ev.currentTarget.id : "call";
        //var helperId = button.split("call")[1];

        let helperId = '';
        if (helperId === "")
            helperId = null;
        else
            helperId = parseInt(helperId);
        if (!helperId) {
            //$('#call').attr('disabled', true).unbind('click');
            console.log('entra');
            var hangup = { request: "hangup" };
            sipcall.send({ message: hangup });
            sipcall.hangup();

        } else {
            //$('#call' + helperId).attr('disabled', true).unbind('click');
            var hangup = { request: "hangup" };
            helpers[helperId].sipcall.send({ message: hangup });
            helpers[helperId].sipcall.hangup();
        }

        setshowPanel(true);
        setCurrentCall({ status: null, phone: null });

    }

    //--------------------------------------------------------------------
    // Función que permite crear el objeto Janus e iniciar la transmisión
    //--------------------------------------------------------------------


    //----------------------------------------
    // Funciones utilizadas en elementos html
    //----------------------------------------
    function clickToggleAudio() {
        const newVal = !toggleAudio;
        enableAudioTmp = newVal;
        if (userTalking) {
            changeAudio(newVal);
        }
        setToggleAudio(newVal);
    }

    function changeAudio(newVal) {
        sipcall.createOffer(
            {
                media: {
                    audioSend: newVal, audioRecv: true,		// We DO want audio
                    videoSend: false, videoRecv: false	// We MAY want video
                },

                success: function () {
                    Janus.debug("Got SDP!");
                },
                error: function (error) {
                    Janus.error("WebRTC error:", error);
                    alert("WebRTC error... " + error.message);
                }
            });
    }

    function publishOwnFeed(valueAudioIn, valueVideoIn, valueAudioOut) {
        let replaceAudio = idDeviceInputAudio !== valueAudioIn;
        idDeviceInputAudio = valueAudioIn;
        let replaceVideo = idDeviceInputVideo !== valueVideoIn;
        idDeviceInputVideo = valueVideoIn;

        sipcall.createOffer(
            {
                media: {
                    video: false,
                    audio: {
                        deviceId: {
                            exact: idDeviceInputAudio
                        }
                    },
                    replaceAudio: replaceAudio
                },	// This is an audio only room
                success: function () {
                    Janus.debug("Got SDP!");
                },
                error: function (error) {
                    Janus.error("WebRTC error:", error);
                    alert("WebRTC error... " + error.message);
                }
            });
    }

    function clickChangeDevice(valueAudioIn, valueVideoIn, valueAudioOut) {
        //alert("adioIn=>" + valueAudioIn + " videoIn=>" + valueVideoIn + "audioOut=>" + valueAudioOut);
        publishOwnFeed(valueAudioIn, valueVideoIn, valueAudioOut);
        refStream.current.setSinkId(valueAudioOut);
    }


    const janusState = useSelector(state => state.janus);

    if (!janusState.initialized) {
        return (
            <View>

                <Alert
                    action={<Button color="inherit" size="small" onClick={didInit}> Recargar </Button>}
                    ariant="outlined" severity="info"
                    style={{ width: '100%' }}
                >
                    La central telefonica no está  lista
                </Alert>
            </View>

        )
    }




    return (
        <View>

            <div id="screencapture" hidden={true} width="400px" height="300px">
                <video id="screenvideo" ref={refStream} width="10px" height="10px" autoPlay playsInline />
            </div>

            {/* {
                (currentCall.status === null || currentCall.status === "calling") &&
                <PhoneView>
                    <MainSide>
                        <CssTextField
                            InputProps={{ type: "tel" }}
                            id="standard-basic"
                            label={phoneLabel}
                            fullWidth
                            value={userNumberCall || phoneNumber}
                            onChange={e => setUserNumberCall(e.target.value)}
                        />
                    </MainSide>
                    <PhoneButtons>
                        <GreenButton
                            onClick={() => doCall(userNumberCall.length ? userNumberCall : phoneNumber)}
                            disabled={userNumberCall.length < 3 && phoneNumber.length < 3}
                        >
                            <PhoneRounded />
                        </GreenButton>
                        <RedButton
                            onClick={() => doHangup()}
                            disabled={true}
                        >
                            <CallEndRounded />
                        </RedButton>
                    </PhoneButtons>
                </PhoneView>
            } */}

            {
                showPanel && <PhoneView>
                    <MainSide>
                        <CssTextField>
                            <TextField
                                InputProps={{ type: "number" }}
                                id="standard-basic"
                                label={phoneLabel}
                                fullWidth
                                value={userNumberCall || phoneNumber}
                                onChange={e => setUserNumberCall(e.target.value)}
                            />
                        </CssTextField>
                    </MainSide>
                    <PhoneButtons>
                        <GreenButton disabled={userNumberCall.length ? true : false}>
                            <Button
                                onClick={() => doCall(userNumberCall.length ? userNumberCall : phoneNumber)}
                                disabled={userNumberCall.length < 3 && phoneNumber.length < 3}
                            >
                                <PhoneRounded />
                            </Button>
                        </GreenButton>
                        <RedButton>
                            <Button
                                onClick={() => doHangup()}
                            //disabled={true}
                            >
                                <CallEndRounded />
                            </Button>
                        </RedButton>
                    </PhoneButtons>
                </PhoneView>
            }

            {/* 
            {
                currentCall.status && (currentCall.status === "beep" || currentCall.status === "accepted") &&
                <CallingView>
                    <SipAvatar isOn={true} name={user.name} />
                    <Typography variant="h4">
                        LLAMADA EN CURSO
                    </Typography>
                    <RedButton onClick={() => doHangup()}>
                        <CallEndRounded />
                    </RedButton>
                </CallingView>
            } */}

            {
                !showPanel && <CallingView>
                    <SipAvatar isOn={true} name={user.name} />
                    <Typography variant="h4">
                        LLAMADA EN CURSO
                    </Typography>
                    <RedButton>
                        <Button onClick={() => doHangup()}>
                            <CallEndRounded />
                        </Button>
                    </RedButton>
                </CallingView>
            }


        </View >



    )
}


const View = styled.div`
    display: flex;
    margin: .9em;

`

const PhoneView = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    width:100%;
    .MuiFormLabel-root {
        padding:.3em;
    }
`

const MainSide = styled.div`
    display: flex;
    align-content: center;
    background-color: ${palette.bgs.azn_light};

`

const CallingView = styled.div`
    background-color: ${palette.bgs.azn_dark};
    display: flex;
    border-radius: .9em;
    align-items:center;
    justify-content: space-between;
    h5, h4{
        color:#ffffff;
    }
`

const PhoneButtons = styled.div`
    background-color: ${palette.bgs.light};
    display: flex;
    align-items:center;
    justify-content: flex-end;
    border-bottom-left-radius: 9pt;
    border-bottom-right-radius: 9pt;
`

const RedButton = styled.div`
        margin: '1em';
        display: 'flex';
        color: "#ffffff";
        background: "#FA3E3E";

        &:hover button {
            backgroundColor: "#FA3E3E"
        }

        svg {
            height: '.9em';
            width: '.9em';
            color:red;
        }
`

const GreenButton = styled.div`
        margin: '1em';
        display: 'flex';
        color: "#ffffff";
        background: "#25D366";
        
        &:hover button {
            background: "#25D366"
        },
        svg {
            height: '.9em';
            width: '.9em';
            color: ${props => props.disabled ? 'green' : ''};
        },
        &:disabled {

        }
`

const CssTextField = styled.div`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
        }

        .MuiInput-input {
            font-size: 1.5em;
            color: #ffffff;
            padding: .3em;
        }

        .MuiFormLabel-root {
            color: #ffffff;
        }

        .MuiInputLabel-shrink {
            transform: 'translateY(10px)';
            transform-origin: "top left";
            color: #ffffff;
        }
        
        label.Mui-focused {
            color: #ffffff;
        }

        .MuiInput-underline:after {
            color: #ffffff;
        }

        .MuiOutlinedInput-root {
            fieldset {
                border-color: red;
            }

            &:hover fieldset{
                border-color: yellow;
            }

            .Mui-focused fieldset {
                border-color: green;
            }
        }


`

export default SipTest;