
import Image from "next/image";
import logo from '../../public/vercel.svg'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {

  const { userId } = auth();

  if (userId) redirect('/notes');

  return (
    <main className="flex flex-col h-screen items-center justify-center gap-5">
      <div className='flex items-center gap-4'>
        <Image src={logo}  width={40} height={40} alt={'app logo'} />
        <span className="font-extrabold tracking-tight text-4xl lg:text-5xl">
            Notes.ai
        </span>
      </div>
      <p className=" max-w-prose text-center">An Intelligent Notetaking App built for humans with love by the robots</p>
      <Button asChild size={'lg'}>
          <Link
            href='/notes'
          >
            Open
          </Link>
      </Button>    
    </main>
  );
}
