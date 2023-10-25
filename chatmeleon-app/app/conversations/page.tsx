import Image from "next/image";
import logo from "../../public/images/logo/LavenderLizard_no_BG.png"
import EmptyState from "../components/EmptyState";

export default function Home() {
  return (
    <div className="w-full h-full bg-lavenderLizard-dark flex">
      {/* <div className="w-24 h-full bg-lavenderLizard-dark" > */}
      {/* Navigation bar = GRID syntax = 3 icons */}
      {/* <Image
          src={logo}
          alt="Picture of the logo"
          width={70}
          style={{
            marginTop: '10px',
            marginLeft: '1.25rem',
            marginBottom: '7rem'
          }}
        />
        <div className="w-1/2 h-1/3 pl-7 grid grid-rows-3 gap-5">
          <button className="w-full h-full hover:bg-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" className="w-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </button>
          <button className="w-full h-full hover:bg-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" className="w-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </button>
          <button className="w-full h-full hover:bg-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" className="w-10">
              <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </button>
        </div> */}
      {/* </div> */}
      <div className="w-full h-95% flex m-5 rounded-3xl bg-lavenderLizard-light">
        <div className="w-1/5 h-85% m-5 rounded-3xl bg-white">
          <h1 className="text-sm lg:text-lg pt-3 pl-4 font-semibold">Chat</h1>
          <div className="hidden lg:flex lg:w-85% lg:h-7 m-2 p-1.5 bg-gray-300 text-black rounded-xl">
            <input type="text" placeholder="Find your friends" className="w-full h-full text-xs lg:text-sm bg-gray-300 focus:outline-none ring-0" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-auto">
              < path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          {/* Choose which user to chat using GRID syntax to split users into slots */}
        </div>
        <EmptyState className="w-full bg-transparent" />
      </div>
    </div >
  )
}
