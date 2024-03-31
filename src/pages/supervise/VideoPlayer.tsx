import ReactPlayer from "react-player";
import React, {RefObject} from "react";
import {StudentParticipation} from "../../models/StudentParticipation";
import {Skeleton} from "@mui/material";

interface VideoPlayerProps {
    playerRef: RefObject<ReactPlayer>,
    focusedStudent: StudentParticipation | undefined,
    onError: (e: Error) => void,
}

function VideoPlayer({playerRef, focusedStudent, onError}: VideoPlayerProps) {
    if (!focusedStudent) {
        return (<Skeleton variant="rectangular" width={"100%"} height={"480px"}/>);
    }
    return (
        <ReactPlayer
            ref={playerRef}
            url={focusedStudent.hlsStreamUrl}
            playsinline
            pip={false}
            playing={true}
            muted={true}
            controls={false}
            width="100%"
            height="100%"
            config={{
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
            }}
            onError={onError}
        />
    );
}

export default VideoPlayer;