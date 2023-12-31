'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

interface Props {
    routeType: string;
}
const SearchBar = ({ routeType }: Props) => {
    const router = useRouter();
    const [search, setSearch] = useState("");



    return (
        <div className='searchbar'>
            <Image
                src='/assets/search-gray.svg'
                alt='search'
                width={24}
                height={24}
                className='object-contain'
            />
            <Input
                id='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`${routeType !== "/search" ? "Search communities" : "Search creators"
                    }`}
                className='no-focus searchbar_input'
            />
        </div>
    );
}

export default SearchBar
