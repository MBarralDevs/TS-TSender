import Image from "next/image";
import Header from "../components/Header"; 
import AirdropForm from "../components/AirdropForm";
import HomeContent from "../components/HomeContent";
import { useAccount } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  return (
    <div>
      <Header />
      <HomeContent />
    </div>
  );
}
