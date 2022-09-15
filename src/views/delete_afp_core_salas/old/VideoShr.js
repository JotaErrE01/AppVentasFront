import React from 'react'

const VideoShr = () => {
    return (
        <div>
            <h1>Video Sample Page</h1>

            <p>This is the video we will work with. It uses a movie from the Blender Foundation (thanks :) )</p>
                <video id='video' controls="controls" preload='none' width="600" poster="http://media.w3.org/2010/05/sintel/poster.png">
                    <source id='mp4' src="http://media.w3.org/2010/05/sintel/trailer.mp4" type='video/mp4' />
                    <source id='webm' src="http://media.w3.org/2010/05/sintel/trailer.webm" type='video/webm' />
                    <source id='ogv' src="http://media.w3.org/2010/05/sintel/trailer.ogv" type='video/ogg' />

                    <track kind="subtitles" label="English subtitles" src="subtitles_en.vtt" srclang="en" default>
                    </track>

                    <track kind="subtitles" label="Deutsche Untertitel" src="subtitles_de.vtt" srclang="de">
                    </track>


                    <p>Your user agent does not support the HTML5 Video element.</p>
                </video>
        </div>
    )
}

export default VideoShr
