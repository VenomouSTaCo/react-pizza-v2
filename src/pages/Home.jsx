import React, {useRef} from "react";
import qs from 'qs';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from "react-router-dom";
import {sortList} from "../components/Sort";

import Categories from "../components/Categories";
import Sort from "../components/Sort";
import Skeleton from "../components/PizzaBlock/Skeleton";
import PizzaBlock from "../components/PizzaBlock";
import Pagination from "../components/Pagination";


import {setCategoryId, setCurrentPage, setSort, setFilters} from "../redux/slices/filterSlice";
import axios from "axios";
import {SearchContext} from "../App";

export const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSearch = useRef(false);
    const isMounted = useRef(false)

    const {categoryId, sort, currentPage} = useSelector((state) => state.filter);
    const {searchValue} = React.useContext(SearchContext);
    const [items, setItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const onChangePage = (page) => {
        dispatch(setCurrentPage(page));
    }

    const onClickCategory = (id) => {
        dispatch(setCategoryId(id))
    };

    const fetchPizzas = () => {
        setIsLoading(true);

        const category = categoryId > 0 ? String(categoryId) : '';
        const sortBy = sort.sortProperty.replace('-', '');
        const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
        const search = searchValue ? `search=${searchValue}` : '';

        axios.get(`https://62e373dbb54fc209b889514c.mockapi.io/items?page=${currentPage}&limit=4&category=${category}&sortBy=${sortBy}&order=${order}&${search}`)
            .then((res) => {
                setItems(res.data);
                setIsLoading(false);
            });
    }


    React.useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sortProperty: sort.sortProperty,
                categoryId,
                currentPage,
            });
            navigate(`?${queryString}`);
        }
        isMounted.current = true;

    }, [categoryId, sort.sortProperty, currentPage]);


    React.useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(window.location.search.substring(1));

            const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty);

            dispatch(
                setFilters({
                    ...params,
                    sort,
                }),
            );
            isSearch.current = true;
        }
    }, []);


    React.useEffect(() => {
        window.scrollTo(0, 0)

        if (!isSearch.current) {
            fetchPizzas();
        }

        isSearch.current = false;
    }, [categoryId, sort.sortProperty, searchValue, currentPage])

    const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);

    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>);

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onClickCategory={onClickCategory}/>
                <Sort value={sort}/>
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items"> {isLoading ? skeletons : pizzas}</div>
            <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
        </div>
    )
}