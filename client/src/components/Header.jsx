import ProfileSelector from './ProfileSelector';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Event Management</h1>
        <p className="header-subtitle">Create and manage events across multiple timezones</p>
      </div>
      <div className="header-right">
        <ProfileSelector />
      </div>
    </header>
  );
}

export default Header;
