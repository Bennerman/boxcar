import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Footer() {
  return (
    <footer className="bg-dark text-light p-3 footer mt-auto py-3">
      <div className="container text-center">
        <a href="https://twitter.com" className="text-light me-3">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a href="https://facebook.com" className="text-light me-3">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a href="https://instagram.com" className="text-light">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;