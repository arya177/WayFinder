import React from "react";
import Navbar from "../components/Navbar";
import SearchResult from "../components/SearchResults";

const SearchPage = () => {
    
    return (
        <>
            <div>
                <Navbar/>
                <SearchResult />
            </div>
        </>
    )
}

export default SearchPage;