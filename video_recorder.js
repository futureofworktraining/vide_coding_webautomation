import { spawn } from 'child_process';
import fs from 'fs';

/**
 * Starts a screen recording of a specific area using FFmpeg.
 * @param {object} options - The recording options.
 * @param {number} options.x - The horizontal offset (left position) to start recording from.
 * @param {number} options.y - The vertical offset (top position) to start recording from.
 * @param {number} options.width - The width of the area to record.
 * @param {number} options.height - The height of the area to record.
 * @returns {Promise<import('child_process').ChildProcess>} The spawned FFmpeg process.
 */
async function startRecording({ x, y, width, height }) {
    const outputPath = 'screenshots/recording.mp4';
    console.log(`Starting screen recording. Output will be saved to: ${outputPath}`);
    fs.mkdirSync('screenshots', { recursive: true });

    // Ensure dimensions are even numbers for the video encoder (libx264 requirement).
    const safeWidth = width % 2 === 0 ? width : width - 1;
    const safeHeight = height % 2 === 0 ? height : height - 1;

    if (safeWidth !== width || safeHeight !== height) {
        console.log(`Original dimensions ${width}x${height} adjusted to ${safeWidth}x${safeHeight} for video encoding compatibility.`);
    }

    let ffmpegArgs;
    if (process.platform === 'win32') {
        console.log(`Windows detected. Recording specific area at ${safeWidth}x${safeHeight} with offset ${x},${y}.`);
        ffmpegArgs = [
            '-y', '-f', 'gdigrab', '-framerate', '30', '-thread_queue_size', '1024',
            '-probesize', '10M', '-offset_x', x.toString(), '-offset_y', y.toString(),
            '-video_size', `${safeWidth}x${safeHeight}`, '-i', 'desktop', '-c:v', 'libx264',
            '-preset', 'ultrafast', '-tune', 'zerolatency', '-pix_fmt', 'yuv420p', outputPath
        ];
    } else {
        // Fallback for other OSes
        const input = (process.platform === 'darwin') ? '1:0' : (process.env.DISPLAY || ':0.0');
        const format = (process.platform === 'darwin') ? 'avfoundation' : 'x11grab';
        ffmpegArgs = [
            '-y', '-f', format, '-i', input, '-c:v', 'libx264',
            '-preset', 'ultrafast', '-pix_fmt', 'yuv420p', outputPath
        ];
    }

    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

    let ffmpegLogs = '';
    ffmpegProcess.stderr.on('data', (data) => { ffmpegLogs += data.toString(); });
    ffmpegProcess.on('close', (code) => {
        if (code !== 0 && code !== 255) {
            console.error(`FFmpeg process exited unexpectedly with code ${code}.`);
            console.error('--- FFmpeg Logs ---\n' + ffmpegLogs + '--- End FFmpeg Logs ---');
        }
    });
    ffmpegProcess.on('error', (err) => { console.error('Failed to start FFmpeg process.', err); });

    // Give FFmpeg a moment to initialize before the script continues
    await new Promise(resolve => setTimeout(resolve, 1500));
    return ffmpegProcess;
}

/**
 * Gracefully stops the FFmpeg recording process.
 * @param {import('child_process').ChildProcess} ffmpegProcess The process to stop.
 */
async function stopRecording(ffmpegProcess) {
    return new Promise((resolve) => {
        if (!ffmpegProcess || ffmpegProcess.killed || ffmpegProcess.exitCode !== null) {
            resolve();
            return;
        }
        console.log('Stopping screen recording...');
        ffmpegProcess.on('close', () => {
            console.log('Recording stopped and file saved.');
            resolve();
        });
        try {
            ffmpegProcess.stdin.write('q');
            ffmpegProcess.stdin.end();
        } catch (e) {
            ffmpegProcess.kill('SIGINT');
            resolve();
        }
    });
}

async function getViewport(page) {
    let viewport = await page.evaluate(() => {
            return {
                x: window.screenX,
                y: window.screenY,
                width: window.innerWidth,
                height: window.innerHeight
            };
        });

    return viewport;
}

export {
    startRecording,
    stopRecording,
    getViewport
    }
