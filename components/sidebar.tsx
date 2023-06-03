import Link from 'next/link';

function Sidebar() {
  return (
    <div className="bg-black text-white w-64 min-h-screen p-5">
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/">
              <a className="text-lg font-bold">Home</a>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/test-1">
              <a className="text-lg font-bold">炒菜时间轴</a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
