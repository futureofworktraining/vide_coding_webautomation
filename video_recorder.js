import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';

export const startRecording = async (page, quality = 'medium', framerate = 10) => {
    let videoConfig = {
        followNewPages: true,
        fps: framerate,
        videoFrame: {
            width: 1920,
            height: 1080,
        },
        videoCodec: 'libx264',
        videoPreset: 'ultrafast',
        autopad: {
            color: 'black'
        },
        aspectRatio: '16:9'
    };

    switch (quality) {
        case 'low':
            videoConfig.videoCrf = 40;
            videoConfig.videoBitrate = 500;
            break;
        case 'high':
            videoConfig.videoCrf = 20;
            videoConfig.videoBitrate = 2000;
            break;
        case 'medium':
        default:
            videoConfig.videoCrf = 30;
            videoConfig.videoBitrate = 1000;
            break;
    }

    const recorder = new PuppeteerScreenRecorder(page, videoConfig);
    await recorder.start('./screenshots/recording.mp4');
    return recorder;
};

export const stopRecording = async (recorder) => {
    if (recorder) {
        await recorder.stop();
    }
};
