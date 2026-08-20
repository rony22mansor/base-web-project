'use client'
import Image from "next/image";

export default function HeaderSection() {
    return <>
        <Image src={"/logo.svg"} alt={"logo"}
            width={150} height={50}
        />
    </>
}