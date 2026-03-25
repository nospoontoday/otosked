import { useNavigate } from 'react-router-dom';

const Header = ({ left, right }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        {left}
      </div>
      <div className="flex items-center">
        {right}
      </div>
    </header>
  );
};

export default Header;