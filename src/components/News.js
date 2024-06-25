import React, { useEffect, useState, useCallback } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    const { setProgress, country, category, apiKey, pageSize } = props;

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews = useCallback(async () => {
        try {
            setProgress(0);
            const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
            setLoading(true);
            let data = await fetch(url);
            let parsedData = await data.json();
            setArticles((prevArticles) => [...prevArticles, ...parsedData.articles]);
            setTotalResults(parsedData.totalResults);
            setLoading(false);
            setProgress(100);
        } catch (error) {
            console.error('Error fetching news:', error);
            setLoading(false); // Ensure loading state is turned off in case of error
        }
    }, [setProgress, country, category, apiKey, pageSize, page]);

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(category)} - NewsMonkey`;
        updateNews();
    }, [category, updateNews]);

    const fetchMoreData = useCallback(() => {
        setPage(prevPage => prevPage + 1);
    }, []);

    const handleLoadMore = () => {
        fetchMoreData();
    };

    return (
        <>
            <h1 className='text-center' style={{
                backgroundColor: 'rgba(250, 219, 255, 0.3)',
                padding: '0.9%', fontWeight: '650', color: 'purple', marginTop: '68px'
            }}> NewsMonkey - Top {capitalizeFirstLetter(category)} Headlines </h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={updateNews}
                hasMore={articles.length < totalResults}
                loader={<Spinner />}
            >
                <div className='container'>
                    <div className="row">
                        {articles.map((element, index) => (
                            <div className="col-md-4" key={index} style={{ padding: '1%' }}>
                                <NewsItem
                                    title={element.title ? element.title.slice(0, 45) : ""}
                                    description={element.description ? element.description.slice(0, 88) : ""}
                                    imageUrl={element.urlToImage}
                                    newsUrl={element.url}
                                    author={element.author}
                                    date={element.publishedAt}
                                    source={element.source.name}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </InfiniteScroll>
            <button onClick={handleLoadMore}>Load More</button>
        </>
    );
}

News.defaultProps = {
    country: 'in',
    pageSize: 12,
    category: 'General'
}

News.propTypes = {
    setProgress: PropTypes.func.isRequired,
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    apiKey: PropTypes.string.isRequired,
}

export default News;
