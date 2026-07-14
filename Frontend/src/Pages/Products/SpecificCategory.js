import React, { useEffect, useState } from "react";
import TopNavbar from "../../Components/Header/TopNavbar";
import Footer from "../../Components/Footer/Footer";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ProductCard from "../../Components/Product/Card/ProductCard";
import { useSelector } from "react-redux";
import Pagination from "../../Components/Pagination/Pagination";

const SpecificCategory = () => {
  const [search, setSearch] = useState("");
  const { categories } = useSelector((state) => state.categories);
  const { products } = useSelector((state) => state.products);
  let { SpecificCategory } = useParams();
  const [categoryProducts, setCategoryProducts] = useState([]);

  useEffect(() => {
    let categoryId = categories.find((element) => element.name === SpecificCategory).id;
    let data = products.filter((p) => p.CategoryId === categoryId);
    setCategoryProducts(data);
  }, [SpecificCategory, categories, products]);
  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage= 12;

  const lastItemIndex = currentPage * perPage;
  const firstItemIndex = lastItemIndex - perPage;

  const filtered = categoryProducts.filter((item) =>
    search.toLocaleLowerCase() === "" ? item : item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  return (
    <div className="page-shell">
      <TopNavbar />
      <main className="page-main">
        <Container className="my-4 pb-5">
          <div className="section-heading">
            <div>
              <span className="eyebrow text-capitalize">{SpecificCategory}</span>
              <h2>All shoes</h2>
            </div>
          </div>
          <Form>
            <InputGroup className="mb-4">
              <Form.Control onChange={(e) => setSearch(e.target.value)} placeholder="Search by product name" />
            </InputGroup>
          </Form>
          <Row className="g-3">
            {filtered.slice(firstItemIndex, lastItemIndex).map((product) => (
              <Col xs={6} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          <Pagination
            totalItems={filtered.length}
            perPage={perPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default SpecificCategory;
