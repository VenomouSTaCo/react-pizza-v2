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


import {setCategoryId, setCurrentPage, setFilters} from "../redux/slices/filterSlice";
import {fetchPizzas} from "../redux/slices/pizzaSlice";
import {SearchContext} from "../App";

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isMounted = useRef(false)

    const {items, status} = useSelector((state) => state.pizza);
    const {categoryId, sort, currentPage, searchValue} = useSelector((state) => state.filter);

    const onClickCategory = (id) => {
        dispatch(setCategoryId(id))
    };

    const onChangePage = (page) => {
        dispatch(setCurrentPage(page));
    }

    const getPizzas = async () => {
        const category = categoryId > 0 ? String(categoryId) : '';
        const sortBy = sort.sortProperty.replace('-', '');
        const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
        const search = searchValue ? `&search=${searchValue}` : '';

        dispatch(
            fetchPizzas({
                sortBy,
                category,
                order,
                search,
                currentPage: currentPage,
            }),
        );

        window.scrollTo(0, 0);
    }


    React.useEffect(() => {
        if (isMounted.current) {
            const params = {
                categoryId: categoryId > 0 ? categoryId : null,
                sortProperty: sort.sortProperty,
                currentPage,
            };

            const queryString = qs.stringify(params, {skipNulls: true})
            navigate(`/?${queryString}`);
        }

        if (!window.location.search) {
            fetchPizzas();
        }

    }, [categoryId, sort.sortProperty, currentPage]);


    React.useEffect(() => {
        getPizzas()
    }, [categoryId, sort.sortProperty, searchValue, currentPage])

    React.useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(window.location.search.substring(1));

            const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty);

            if (sort) {
                params.sort = sort;
            }
            dispatch(setFilters(params));
        }
        isMounted.current = true;
    }, []);


    const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);

    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>);

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onClickCategory={onClickCategory}/>
                <Sort value={sort}/>
            </div>
            <h2 className="content__title">Все пиццы</h2>
            {status === 'error' ? (
                <div className="content__error-info">
                    <h2>Произошла ошибка 😕</h2>
                    <p>К сожалению, не удалось получить питсы. Попробуйте повторить попытку позже.</p>
                </div>
            ) : (<div className="content__items"> {status === 'loading' ? skeletons : pizzas}</div>
            )}
            < Pagination currentPage={currentPage} onChangePage={onChangePage}/>
        </div>);
}

export default Home;