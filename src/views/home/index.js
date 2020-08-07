import React, { useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';

import { CCol, CRow, CImg, CCard, CInput, CContainer, CSpinner, CPagination, CCardBody, CCardHeader, CCardFooter } from '@coreui/react';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ENDPOINT } from '../../constants';

import axios from 'axios';

const HomePage = () => {
  const [onChange$] = useState(() => new Subject());
  const [isLoaded, setIsLoaded] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [currentPage, setActivePage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {
    axios.get(ENDPOINT).then(res => {
      const result = res.data.map(item => {
        return { keys: initKeys(item), ...item };
      });
      setIsLoaded(true);
      setProducts(result);
      setActivePage(1);
      setPerPage(12);
      setLastPage(Math.ceil(result.length / perPage));
    });

    const subscription = onChange$.pipe(debounceTime(1000)).subscribe(key => {
      setKeyword(key);
      setActivePage(1);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const initKeys = item => {
    const keys = `${item.name} ${item.brand} ${item.code}`.split(' ').map(x => x.trim().toLowerCase());
    return Array.from(new Set(keys)).join(' ');
  };

  const onChange = value => {
    onChange$.next(value);
  };

  const getProducts = () => {
    const result = products
      .filter(x => findByKeys(x.keys, keyword.toLowerCase().split(' ')))
      .map(x => {
        return {
          ...x,
          relevance: countWords(x.keys, keyword.toLowerCase()),
        };
      })
      .sort((a, b) => parseFloat(b.relevance) - parseFloat(a.relevance));

    // setLastPage(Math.ceil(result.length / perPage));
    return result.filter((_x, idx) => idx >= perPage * (currentPage - 1) && idx < perPage * currentPage);
  };

  const getAllSubsets = array => array.reduce((subsets, value) => subsets.concat(subsets.map(set => [value, ...set])), [[]]);

  const countWords = (text, key) => {
    const subsets = [...new Set(getAllSubsets(key.split(' ')))].map(x => x.reverse().join(' ')).filter(x => x.length);
    console.log(subsets);
    return subsets.reduce(function (a, b) {
      const re = new RegExp(`${b}`, 'g');
      return a + b.length > 0 ? ((text || '').match(re) || []).length : 0;
    }, 0);
  };

  const findByKeys = (keys, key) => {
    if (Array.isArray(key)) {
      for (let i = 0; i < key.length; i += 1) {
        if (findByKeys(keys, key[i])) {
          return true;
        }
      }
      return false;
    }

    return !!keys.includes(key.toLowerCase());
  };

  return (
    <CContainer>
      <CRow>
        <CCol xs="12" md="12" xl="12">
          <CCard>
            <CCardHeader>Products</CCardHeader>
            <CCardBody>
              <CInput
                type="text"
                id="keyword"
                name="keyword"
                placeholder="Enter key for serach..."
                onChange={e => {
                  onChange(e.target.value);
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs="12" md="12" xl="12">
          <CRow>
            {getProducts().length > 0 ? (
              getProducts().map((item, idx) => {
                return (
                  <CCol xs="2" md="4" xl="3" key={idx}>
                    <CCard>
                      <CCardBody>
                        <div
                          className="item-img"
                          style={{
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '100% auto',
                            backgroundImage: 'url(' + item.imageUrl + ')',
                          }}
                        >
                          <CImg className="img-fluid" src="/transparent.png" alt={item.imageUrl} />
                        </div>
                        <div className="title">
                          <Highlighter
                            highlightClassName="red"
                            searchWords={keyword.split(' ')}
                            autoEscape={true}
                            textToHighlight={item.name}
                          />
                        </div>
                        <div>
                          <Highlighter
                            highlightClassName="red"
                            searchWords={keyword.split(' ')}
                            autoEscape={true}
                            textToHighlight={`Brand: ${item.brand}`}
                          />
                        </div>
                        <div>
                          <Highlighter
                            highlightClassName="red"
                            searchWords={keyword.split(' ')}
                            autoEscape={true}
                            textToHighlight={`Code: ${item.code}`}
                          />
                        </div>
                      </CCardBody>
                      <CCardFooter>Price: ${item.price.toFixed(2)}</CCardFooter>
                    </CCard>
                  </CCol>
                );
              })
            ) : isLoaded && keyword ? (
              <>Your search '{keyword}' did not match any documents.</>
            ) : (
              <>
                Loading...
                <CSpinner color="success" size="sm" />
              </>
            )}
          </CRow>
          <CRow>
            <CCol xs="12" md="12" xl="12">
              <CPagination activePage={currentPage} pages={lastPage} onActivePageChange={page => setActivePage(page)}></CPagination>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default HomePage;
