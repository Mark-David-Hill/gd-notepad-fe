// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useState } from "react";

export default function Search(props) {
  const { setSearchTerm, setOrderBy, orderBy, placeholder } = props;
  // const [orderCategory, setOrderCategory] = useState("id");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // const handleSelect = (e) => {
  //   setOrderCategory(e.target.value.toLowerCase());
  // };

  return (
    <div className="search-wrapper">
      <div className="filter-wrapper">
        {/* <select name="filter-by" id="filter-by" onChange={handleSelect}>
          <option value="id">Sort By ID:</option>
          <option value="price">By Price</option>
          <option value="alphabet">Alphabetical</option>
        </select> */}
        {/* <button onClick={() => setOrderBy(orderBy === "desc" ? "asc" : "desc")}> */}
        {/* {orderBy === "desc" ? (
            <FontAwesomeIcon icon="fa-sort-down" />
          ) : (
            <FontAwesomeIcon icon="fa-sort-up" />
          )} */}
        {/* </button> */}
      </div>
      <input type="text" placeholder={placeholder} onChange={handleSearch} />
    </div>
  );
}
