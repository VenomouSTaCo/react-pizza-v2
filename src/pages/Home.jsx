import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import axios from "axios";

import {setCategoryId} from "../redux/slices/filterSlice";

import Categories from "../components/Categories";
import Sort from "../components/Sort";
import Skeleton from "../components/PizzaBlock/Skeleton";
import PizzaBlock from "../components/PizzaBlock";
import Pagination from "../components/Pagination";
import {SearchContext} from "../App";

export const Home = () => {
    const {searchValue} = React.useContext(SearchContext);
    const [items, setItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const {categoryId, sort} = useSelector((state) => state.filter);
    const sortType = sort.sortProperty;
    const [currentPage, setCurrentPage] = React.useState(1);

    const dispatch = useDispatch();

    const onClickCategory = (id) => {
        dispatch(setCategoryId(id))
    };

    React.useEffect(() => {
        setIsLoading(true);

        const category = categoryId > 0 ? String(categoryId) : '';
        const sortBy = sortType.replace('-', '');
        const order = sortType.includes('-') ? 'asc' : 'desc';
        const search = searchValue ? `search=${searchValue}` : '';

        axios.get(`https://62e373dbb54fc209b889514c.mockapi.io/items?page=${currentPage}&limit=4&category=${category}&sortBy=${sortBy}&order=${order}&${search}`)
            .then((res) => {
                    setItems(res.data);
                    setIsLoading(false);
                }
            )
        window.scrollTo(0, 0)
    }, [categoryId, sortType, searchValue, currentPage]);

    const pizzas = items.filter((obj) => {
        return obj.title.toLowerCase().includes(searchValue.toLowerCase())
    }).map((obj) => <PizzaBlock key={obj.id} {...obj}/>);

    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>);

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onClickCategory={onClickCategory}/>
                <Sort/>
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items"> {isLoading ? skeletons : pizzas}</div>
            <Pagination onChangePage={(number) => setCurrentPage(number)}/>
        </div>
    )
}