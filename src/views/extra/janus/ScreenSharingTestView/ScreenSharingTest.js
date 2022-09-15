/* eslint-disable react/jsx-one-expression-per-line */
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

var janusShr = null;
var screentest = null;
var opaqueId = "screensharingtest-"+Janus.randomString(12);

var myusername = null;
var myid = null;

var capture = null;
var role = null;
var room = null;
var source = null;

// Just an helper to generate random usernames
function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz,randomPoz+1);
  }
  return randomString;
}

function ScreenSharingTest() {
  const [error, setError] = useState(false);
  const [janusReady, setJanusReady] = useState(false);
  const [janusSharingReady, setJanusSharingReady] = useState(false);

  const [mensajeError, setMensajeError] = useState('');
  const [streamView, setStreamView] = useState(false);
  const [sharingReady, setSharingReady] = useState(false);
  
  const refStream = useRef(null);

  const [idSession, setIdSession] = useState('');
  const [screenTitle, setScreenTitle] = useState('');

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
      if (janusShr){
        janusShr.destroy();
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
  function dejarTodoListo() {
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
    if (streamView || sharingReady || janusSharingReady) { 
      refStream.current.srcObject = null;
      setSharingReady(false);
      setStreamView(false);
      setJanusSharingReady(false);
      janusShr.destroy();
      return;
      //setJanusReady(false); 
    }
    
    //-----------------------------------------------------------------
    // Creamos el objeto Janus que nos permitirá crear los componentes
    //-----------------------------------------------------------------
 			// Create session
       janusShr = new Janus(
				{
					server: server,
					success: function() {
						// Attach to VideoRoom plugin
						janusShr.attach(
							{
								plugin: "janus.plugin.videoroom",
								opaqueId: opaqueId,
								success: function(pluginHandle) {
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
								error: function(error) {
									Janus.error("  -- Error attaching plugin...", error);
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
								webrtcState: function(on) {
									Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                  //$("#screencapture").parent().unblock();
                  //refStream.current.parent().unblock();
									if(on) {
										alert("Your screen sharing session just started: pass the <b>" + room + "</b> session identifier to those who want to attend.");
									} else {
										alert("Your screen sharing session just stopped.");
										janusShr.destroy();
										//window.location.reload();
									}
								},
								onmessage: function(msg, jsep) {
									Janus.debug(" ::: Got a message (publisher) :::");
									Janus.debug(msg);
									var event = msg["videoroom"];
									Janus.debug("Event: " + event);
									if(event != undefined && event != null) {
										if(event === "joined") {
											myid = msg["id"];
                      //$('#session').html(room);
                      setIdSession(room);
                      //$('#title').html(msg["description"]);
                      setScreenTitle(msg["description"]);
											Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);
											if(role === "publisher") {
												// This is our session, publish our stream
												Janus.debug("Negotiating WebRTC stream for our screen (capture " + capture + ")");
												screentest.createOffer(
													{
														media: { video: capture, audioSend: true, videoRecv: false},	// Screen sharing Publishers are sendonly
														success: function(jsep) {
															Janus.debug("Got publisher SDP!");
															Janus.debug(jsep);
															var publish = { "request": "configure", "audio": true, "video": true };
															screentest.send({"message": publish, "jsep": jsep});
														},
														error: function(error) {
															Janus.error("WebRTC error:", error);
                              //bootbox.alert("WebRTC error... " + JSON.stringify(error));
                              setMensajeError("WebRTC error... " + JSON.stringify(error));
                              setError(true);
														}
													});
											} else {
												// We're just watching a session, any feed to attach to?
												if(msg["publishers"] !== undefined && msg["publishers"] !== null) {
													var list = msg["publishers"];
													Janus.debug("Got a list of available publishers/feeds:");
													Janus.debug(list);
													for(var f in list) {
														var id = list[f]["id"];
														var display = list[f]["display"];
														Janus.debug("  >> [" + id + "] " + display);
														newRemoteFeed(id, display)
													}
												}
											}
										} else if(event === "event") {
											// Any feed to attach to?
											if(role === "listener" && msg["publishers"] !== undefined && msg["publishers"] !== null) {
												var list = msg["publishers"];
												Janus.debug("Got a list of available publishers/feeds:");
												Janus.debug(list);
												for(var f in list) {
													var id = list[f]["id"];
													var display = list[f]["display"];
													Janus.debug("  >> [" + id + "] " + display);
													newRemoteFeed(id, display)
												}
											} else if(msg["leaving"] !== undefined && msg["leaving"] !== null) {
												// One of the publishers has gone away?
												var leaving = msg["leaving"];
												Janus.log("Publisher left: " + leaving);
												if(role === "listener" && msg["leaving"] === source) {
                          alert("The screen sharing session is over, the publisher left");
													//window.location.reload();
												}
											} else if(msg["error"] !== undefined && msg["error"] !== null) {
                        setMensajeError(msg["error"]);
                        setError(true);
											}
										}
									}
									if(jsep !== undefined && jsep !== null) {
										Janus.debug("Handling SDP as well...");
										Janus.debug(jsep);
										screentest.handleRemoteJsep({jsep: jsep});
									}
								},
								onlocalstream: function(stream) {
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
                  setSharingReady(true);
                  setStreamView(false);

									if(screentest.webrtcStuff.pc.iceConnectionState !== "completed" &&
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
								onremotestream: function(stream) {
									// The publisher stream is sendonly, we don't expect anything here
								},
								oncleanup: function() {
									Janus.log(" ::: Got a cleanup notification :::");
									//$('#screencapture').empty();
                  //$("#screencapture").parent().unblock();
                  //refStream.current.empty();
                  //refStream.current.parent().unblock();
                  
                  //$('#room').hide();
                  setSharingReady(false);
                  setStreamView(false);
								}
							});
					},
					error: function(error) {
						Janus.error(error);
						//bootbox.alert(error, function() {
						//	window.location.reload();
            //});
            setMensajeError(error);
            setError(true);
					},
					destroyed: function() {
						window.location.reload();
					}
        });
        
        setJanusSharingReady(true);
  }

  function newRemoteFeed(id, display) {
    // A new feed has been published, create a new plugin handle and attach to it as a listener
    source = id;
    var remoteFeed = null;
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
          Janus.debug("Event: " + event);
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
          setSharingReady(false);
          setStreamView(true);
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
  function preShareScreen(titleShared) {
    if(!Janus.isExtensionEnabled()) {
      alert("You're using Chrome but don't have the screensharing extension installed: click <b><a href='https://chrome.google.com/webstore/detail/janus-webrtc-screensharin/hapfgfdkleiggjjpfpenajgdnfckjpaj' target='_blank'>here</a></b> to do so");
      //, function() {
      //  window.location.reload();
      //});
      return;
    }
    // Create a new room
    // NOTA: Aqui como que hay que reiciar todo
    //$('#desc').attr('disabled', true);
    //$('#create').attr('disabled', true).unbind('click');
    //$('#roomid').attr('disabled', true);
    //$('#join').attr('disabled', true).unbind('click');
    //if($('#desc').val() === "") {
    //  bootbox.alert("Please insert a description for the room");
    //  $('#desc').removeAttr('disabled', true);
    //  $('#create').removeAttr('disabled', true).click(preShareScreen);
    //  $('#roomid').removeAttr('disabled', true);
    //  $('#join').removeAttr('disabled', true).click(joinScreen);
    //  return;
    //}
    capture = "screen";
    if(navigator.mozGetUserMedia) {
      // Firefox needs a different constraint for screen and window sharing
      bootbox.dialog({
        title: "Share whole screen or a window?",
        message: "Firefox handles screensharing in a different way: are you going to share the whole screen, or would you rather pick a single window/application to share instead?",
        buttons: {
          screen: {
            label: "Share screen",
            className: "btn-primary",
            callback: function() {
              capture = "screen";
              shareScreen(titleShared);
            }
          },
          window: {
            label: "Pick a window",
            className: "btn-success",
            callback: function() {
              capture = "window";
              shareScreen(titleShared);
            }
          }
        },
        onEscape: function() {
          //$('#desc').removeAttr('disabled', true);
          //$('#create').removeAttr('disabled', true).click(preShareScreen);
          //$('#roomid').removeAttr('disabled', true);
          //$('#join').removeAttr('disabled', true).click(joinScreen);
        }
      });
    } else {
      shareScreen(titleShared);
    }
  }

  function shareScreen(titleShared) {
    // Create a new room
    var desc = titleShared;
    role = "publisher";
    var create = { "request": "create", "description": desc, "bitrate": 500000, "publishers": 1 };
    screentest.send({"message": create, success: function(result) {
      var event = result["videoroom"];
      Janus.debug("Event: " + event);
      if(event != undefined && event != null) {
        // Our own screen sharing session has been created, join it
        room = result["room"];
        Janus.log("Screen sharing session created: " + room);
        myusername = randomString(12);
        var register = { "request": "join", "room": room, "ptype": "publisher", "display": myusername };
        screentest.send({"message": register});
      }
    }});
  }

  function joinScreen(roomId) {
    // Join an existing screen sharing session
    //$('#desc').attr('disabled', true);
    //$('#create').attr('disabled', true).unbind('click');
    //$('#roomid').attr('disabled', true);
    //$('#join').attr('disabled', true).unbind('click');
    //var roomid = refRoomId.current.value;
    //if(isNaN(roomid)) {
    //  bootbox.alert("Session identifiers are numeric only");
    //  $('#desc').removeAttr('disabled', true);
    //  $('#create').removeAttr('disabled', true).click(preShareScreen);
    //  $('#roomid').removeAttr('disabled', true);
    //  $('#join').removeAttr('disabled', true).click(joinScreen);
    //  return;
    //}
    room = parseInt(roomId);
    role = "listener";
    myusername = randomString(12);
    var register = { "request": "join", "room": room, "ptype": "publisher", "display": myusername };
    screentest.send({"message": register});
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
        <h1>Plugin Demo: Screen Sharing Test</h1>
        <Button
            color="secondary"
            disabled={!janusReady}
            size="large"
            type="button"
            variant="contained"
            onClick={() => dejarTodoListo()}
          >
            {(!janusSharingReady)?'Deseo compatir o ver':'Ya no deseo compatir o ver'}
        </Button>
      </div>
      <div>
			<div id="screenmenu">
				<div>
            <TextField
            width="30%"
            disabled={!janusSharingReady || sharingReady || streamView}
            label="Esbriba el titulo de la sesión"
            margin="normal"
            name="desc"
            id="desc"
            type="text"
            variant="outlined"
            />
            <Button
            color="secondary"
            disabled={!janusSharingReady || sharingReady || streamView}
            size="large"
            type="button"
            variant="contained"
            onClick={() => preShareScreen(desc.value)}
          >
            {(!sharingReady)?'Compartir':'Dejar de compartir'}
        </Button>
				</div>
				<div>
					<hr/>or<hr/>
				</div>
				<div>
            <TextField
            width="30%"
            disabled={!janusSharingReady || sharingReady || streamView}
            label="Ingrese el ID de la sesión"
            margin="normal"
            name="roomid"
            id="roomid"
            type="text"
            variant="outlined"
            />
            <Button
            color="secondary"
            disabled={!janusSharingReady || sharingReady || streamView}
            size="large"
            type="button"
            variant="contained"
            onClick={() => joinScreen(roomid.value)}
          >
            {(!streamView)?'Ver':'Dejar de ver'}
        </Button>


				</div>
			</div>
			<div id="room" display="false">
				<div>
  <h3>Screen Capture <span id="title">{screenTitle}</span> <span id="session">{idSession}</span></h3>
				</div>
				<div id="screencapture" width="400px" height="300px">
            <video id="screenvideo" ref={refStream} width="400px" height="300px" autoPlay playsInline />
        </div>
			</div>
      </div>
    </div>
  );
}

export default ScreenSharingTest;