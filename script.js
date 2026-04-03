const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const colorDisplay = document.getElementById('colorDisplay');
const hexText = document.getElementById('hexText');
const rgbText = document.getElementById('rgbText');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// 1. ขออนุญาตเข้าถึงกล้องหลัง
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" }, // ใช้กล้องหลัง
            audio: false 
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตสิทธิ์การใช้กล้อง");
    }
}
function pickColor() {
    if (video.paused || video.ended) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // พิกัดจุดกึ่งกลาง
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);

    // อ่านข้อมูลสีรอบๆ จุดศูนย์กลาง (ขนาด 5x5 พิกเซล)
    const size = 5;
    const offset = Math.floor(size / 2);
    const imageData = ctx.getImageData(centerX - offset, centerY - offset, size, size).data;

    let r = 0, g = 0, b = 0;
    const numPixels = imageData.length / 4;

    // หาค่าเฉลี่ยของ RGB ในพื้นที่ 5x5
    for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
    }

    r = Math.floor(r / numPixels);
    g = Math.floor(g / numPixels);
    b = Math.floor(b / numPixels);

    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

    // แสดงผล
    colorDisplay.style.backgroundColor = hex;
    hexText.innerText = `HEX: ${hex}`;
    rgbText.innerText = `RGB: (${r}, ${g}, ${b})`;

    requestAnimationFrame(pickColor);
}
// 2. ฟังก์ชันดึงค่าสีจากวิดีโอ
function pickColor() {
    if (video.paused || video.ended) return;

    // กำหนดขนาด canvas ให้เท่ากับ video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // วาดภาพปัจจุบันจาก video ลงบน canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // ดึงค่าสีจากจุดกึ่งกลาง (x, y)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;

    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

    // 3. แสดงผล
    colorDisplay.style.backgroundColor = hex;
    hexText.innerText = `HEX: ${hex}`;
    rgbText.innerText = `RGB: (${r}, ${g}, ${b})`;

    requestAnimationFrame(pickColor); // ทำงานต่อเนื่องแบบ Real-time
}

video.addEventListener('play', () => {
    requestAnimationFrame(pickColor);
});

startCamera();