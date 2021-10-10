import Link from "next/link"

function Sidebar() {
    return (
        <div className="w-2/12 border px-4">
            <ul>
                <li>
                    <Link href="/">
                        <a className="font-bold text-gray-800">Home</a>
                    </Link>
                </li>
                <li>
                    <Link href="/myvideos">
                        <a className="font-bold text-gray-800">My Videos</a>
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        <a className="font-bold text-gray-800">Playlist</a>
                    </Link>
                </li>
               
            </ul>
        </div>
    )
}

export default Sidebar
