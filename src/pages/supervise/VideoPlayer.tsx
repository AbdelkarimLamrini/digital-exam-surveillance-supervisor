import ReactPlayer, {Config} from "react-player";
import React, {RefObject} from "react";
import {StudentParticipation} from "../../models/StudentParticipation";
import {Box, Skeleton} from "@mui/material";

const config: Config = {
    file: {
        forceHLS: true,
        hlsOptions: {
            debug: false,
            nudgeOffset: 0.1,
            nudgeMaxRetry: 5,
            initialLiveManifestSize: 1,
            liveSyncDurationCount: 3,
            liveDurationInfinity: true,
            stretchShortVideoTrack: true,
        }
    },
};

interface VideoPlayerProps {
    playerRef: RefObject<ReactPlayer>,
    focusedStudent: StudentParticipation | undefined,
    onError: (e: Error) => void,
}

function VideoPlayer({playerRef, focusedStudent, onError}: VideoPlayerProps) {
    if (!focusedStudent) {
        return (
            <Box sx={{mb: '1em', width: '100%', aspectRatio: '16/9'}}>
                <Skeleton variant="rectangular" width="100%" height="100%"/>
            </Box>
        );
    }
    return (
        <Box sx={{mb: '1em', width: '100%'}}>
            <ReactPlayer
                ref={playerRef}
                url={focusedStudent.hlsStreamUrl}
                playsinline
                pip={false}
                playing={true}
                muted={true}
                controls={true}
                width="100%"
                height="100%"
                config={config}
                onError={onError}
            />
        </Box>
    );
}

export default VideoPlayer;