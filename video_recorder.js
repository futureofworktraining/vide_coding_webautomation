import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';

export const startRecording = async (page) => {
    const recorder = new PuppeteerScreenRecorder(page, {
        followNewPages: true,
        fps: 10,
        videoFrame: {
            width: 1920,
            height: 1080,
        },
        videoCrf: 30,
        videoCodec: 'libx264',
        videoPreset: 'ultrafast',
        videoBitrate: 1000,
        autopad: {
            color: 'black'
        },
        aspectRatio: '16:9'
    });
    await recorder.start('./screenshots/recording.mp4');
    return recorder;
};

export const stopRecording = async (recorder) => {
    if (recorder) {
        await recorder.stop();
    }
};
