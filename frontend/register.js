document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // ตรวจสอบว่า ฟอร์มถูกกรอกครบถ้วนหรือไม่ 
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
        return;
    }

    // หากกรอกข้อมูลครบถ้วน จะซ่อนฟอร์มและแสดงข้อความ "สมัครสมาชิกสำเร็จ"
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('message').style.display = 'block';
});
