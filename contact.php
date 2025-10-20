<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $message = trim($_POST['message']);

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please provide a valid email address.';
    } else {
        $mail = new PHPMailer(true);
        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'samuelasogbon51@gmail.com'; // your Gmail
            $mail->Password   = 'kkff smri lxiz chqr';    // Gmail App Password
            $mail->SMTPSecure = 'tls';
            $mail->Port       = 587;

            // Fix for SSL on XAMPP
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );

            // Recipients
            $mail->setFrom($email, $name);
            $mail->addAddress('samuelasogbon51@gmail.com', 'Samuel Asogbon');

            // Content
            $mail->isHTML(true);
            $mail->Subject = 'New Contact Form Message';
            $mail->Body    = "<strong>Name:</strong> {$name}<br><strong>Email:</strong> {$email}<br><strong>Message:</strong><br>{$message}";

            $mail->send();
            $success = 'Message sent successfully!';
        } catch (Exception $e) {
            $error = 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo;
        }
    }
}
?>

<!doctype html>
<html lang="en">
<link rel="icon" type="assets/" href="./assets/images/LOGO.png">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Contact - Code by Asogbon </title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
  <div class="container">
    <!-- Brand -->
    <a class="navbar-brand fw-bold" href="index.html">
      Asogbon<span class="text-primary">Samuel</span>
    </a>

    <!-- Toggler -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Collapsible Content -->
    <div class="collapse navbar-collapse" id="navMenu">
      <!-- Nav Links -->
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
        <li class="nav-item"><a class="nav-link" href="projects.html">Projects</a></li>
        <li class="nav-item"><a class="nav-link" href="experience.html">Experience</a></li>
        <li class="nav-item"><a class="nav-link active" href="contact.php">Contact</a></li>
      </ul>

      <!-- Theme Toggle -->
      <div class="d-flex ms-lg-3">
        <button id="theme-toggle" class="btn btn-outline-secondary" aria-label="Toggle theme">
          <i class="fas fa-moon"></i>
        </button>
      </div>
    </div>
  </div>
</nav>

  <!-- spacer to push page content below a fixed navbar; JS will update its height -->
  <div id="nav-spacer" aria-hidden="true"></div>

<div class="hero">
<main class="container py-6">
  <h1 class="mt-5 text-center mb-4">Contact Me</h1>
  <p class="lead text-center mb-5">Want to work together or ask a question? Send a message | very responsive to
    messages.</p>

  <div class="row g-4 justify-content-center">
    <!-- Contact Form -->
    <div class="col-lg-6" data-aos="fade-up">
      <div class="card shadow-sm p-4">
        <?php if($success): ?>
        <div class="alert alert-success">
          <?php echo $success; ?>
        </div>
        <?php elseif($error): ?>
        <div class="alert alert-danger">
          <?php echo $error; ?>
        </div>
        <?php endif; ?>

        <form action="contact.php" method="POST" class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Name</label>
            <input name="name" class="form-control" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Email</label>
            <input name="email" type="email" class="form-control" required>
          </div>
          <div class="col-12">
            <label class="form-label">Message</label>
            <textarea name="message" rows="6" class="form-control" required></textarea>
          </div>
          <div class="col-12 text-end">
            <button type="submit" class="btn btn-primary">Send Message</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="col-lg-4" data-aos="fade-left">
      <div class="card shadow-sm p-4 h-100">
        <h5 class="mb-3 text-primary">Other Contacts</h5>
        <p><strong>Email:</strong> samuelasogbon51@gmail.com</p>
        <p><strong>Phone:</strong> +234 905 221 2755</p>
        <p><strong>Address:</strong> 56 Beach Road, Ebute, Ikorodu</p>
      </div>
    </div>
  </div>
</main>
        </div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("slide-up");
    AOS.init({ duration: 800, once: true });
  });
</script>
<script>
  const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const icon = toggleBtn.querySelector('i');

// Check local storage for theme preference
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  icon.classList.replace('fa-moon', 'fa-sun');
}

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
});
</script>
<script src="./assets/js/resize.js"></script>

</body>

  <footer class="footer-bg pt-5">
    <div class="container">

      <!-- Main footer content -->
      <div class="footer-main">
        <div class="row g-5 g-lg-6"> <!-- increased gutter spacing -->

          <!-- 1. Logo and Branding -->
          <div class="col-md-4">
            <a href="./index.html" class="d-flex align-items-center text-decoration-none mb-3 footer-logo">
              <img src="./assets/images/LOGO.png" alt="Logo" width="70">
            </a>
            <p class="small">
              Software Engineer & UI/UX Designer aspiring to build the future of the web.
            </p>
          </div>

          <!-- 2. Quick Links -->
          <div class="col-6 col-md-2">
            <h5 class="fw-semibold mb-3">Quick Links</h5>
            <ul class="list-unstyled small">
              <li><a href="./projects.html" class="footer-link">Projects Showcase</a></li>
              <li><a href="./experience.html" class="footer-link">Technical Expertise</a></li>
              <li><a href="./about.html" class="footer-link">About Me</a></li>
              <li><a href="./contact.php" class="footer-link">Contact</a></li>
            </ul>
          </div>

          <!-- 3. Resources -->
          <div class="col-6 col-md-2">
            <h5 class="fw-semibold mb-3">Resources</h5>
            <ul class="list-unstyled small">
              <li><a href="./projects.html" class="footer-link">UI/UX Portfolio</a></li>
              <li><a href="./about.html" class="footer-link">My Blog</a></li>
              <li><a href="./assets/ASOGBON CV.pdf" class="footer-link">Resume (PDF)</a></li>
            </ul>
          </div>

          <!-- 4. Socials -->
          <div class="col-md-4">
            <h5 class="fw-semibold mb-3">Connect Now</h5>
            <div class="d-flex h3 flex-wrap justify-content-md-start justify-content-center">
              <a href="https://github.com/asogbon1" target="_blank" class="me-4 icon-hover"><i
                  class="fab fa-github"></i></a>
              <a href="https://www.linkedin.com/in/asogbon-samuel-7a8168231" target="_blank" class="me-4 icon-hover"><i
                  class="fab fa-linkedin"></i></a>
              <a href="mailto:samuelasogbon51@gmail.com" class="me-4 icon-hover"><i class="fas fa-envelope"></i></a>
              <a href="tel:09052212755" class="me-4 icon-hover"><i class="fas fa-phone"></i></a>
            </div>
            <p class="small mt-3">Available for new opportunities.</p>
          </div>

        </div>
      </div>

      <!-- Copyright -->
      <div class="row">
        <div class="col text-center py-3">
          <p class="mb-0 small">
            &copy; 2025 Asogbon. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</html>