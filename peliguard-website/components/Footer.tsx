import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info - Left Column */}
          <div className="footer-company">
            <div className="footer-logo-section">
              <div className="footer-logo-image">
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/035599f5-c8b9-45ac-8f0d-37519415b5ba/Peliguard-Icon-Color.png?format=1500w"
                  alt="Peliguard"
                  width={40}
                  height={40}
                  className="footer-logo-img"
                  unoptimized
                />
              </div>
              <h3 className="footer-logo-text">Peliguard</h3>
            </div>
            <p className="footer-description">
              Protecting the American workforce with quality disposable protective equipment, 
              assembled with pride in Independence, Louisiana.
            </p>
            <div className="footer-address">
              <p>51237 Mushroom Lane</p>
              <p>Independence, LA 70443</p>
              <p>
                <a href="mailto:sales@peliguard.com" className="footer-email">
                  sales@peliguard.com
                </a>
              </p>
            </div>
          </div>

          {/* Company Column */}
          <div className="footer-column">
            <h4 className="footer-column-title">Company</h4>
            <ul className="footer-links">
              <li>
                <Link href="/#our-story" className="footer-link">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="footer-column">
            <h4 className="footer-column-title">Resources</h4>
            <ul className="footer-links">
              <li>
                <Link href="/contact#wholesale" className="footer-link">
                  Wholesale
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="footer-column">
            <h4 className="footer-column-title">Support</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:webmaster@peliguard.com" className="footer-link">
                  Webmaster
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">© Copyright 2022 Peliguard. All rights reserved.</p>
            <p className="footer-location">Made in Independence, Louisiana</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
