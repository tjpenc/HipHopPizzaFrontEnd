import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { createOrder, updateOrder } from '../../api/orderData';
import { useAuth } from '../../utils/context/authContext';
import { getPaymentTypes } from '../../api/paymentTypeData';

const initialState = {
  uid: '',
  name: '',
  email: '',
  phone: '',
  orderType: false,
  paymentTypeId: 1,
};

export default function OrderForm({ orderObj }) {
  const [formInput, setFormInput] = useState(initialState);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const router = useRouter();
  const { user } = useAuth();
  // when a field is filled, need to update state

  useEffect(() => {
    getPaymentTypes().then(setPaymentTypes);
    if (orderObj.id) {
      setFormInput(orderObj);
    }
    console.warn(orderObj);
  }, [orderObj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.warn(formInput);
  };

  const addUid = () => {
    formInput.uid = user.uid;
  };

  const handleRadioChange = () => {
    if (!formInput.orderType) {
      formInput.orderType = 'In-person';
    } else {
      formInput.orderType = 'Phone';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRadioChange();
    addUid();
    if (orderObj.id) {
      updateOrder(formInput).then(router.push(`/orders/${orderObj.id}`));
    } else {
      createOrder(formInput).then((order) => router.push(`/addItems/${order.id}`));
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your Name"
            name="name"
            value={formInput.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Customer Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="email@example.com"
            name="email"
            value={formInput.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Customer Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="123-456-789"
            name="phone"
            value={formInput.phone}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Select
          aria-label="Default select example"
          name="paymentTypeId"
          onChange={handleChange}
          value={formInput.paymentTypeId}
          required
        >
          <option value="">Please Select an Option</option>
          {paymentTypes?.map((paymentType) => (
            <option key={paymentType.id} value={paymentType.id}>{paymentType.type}</option>
          ))}
        </Form.Select>
        <Form.Check
          className="mb-3"
          inline
          label="Phone Order?"
          name="orderType"
          type="checkbox"
          value={formInput.orderType}
          onChange={handleRadioChange}
          id="inline-checkbox-1"
        />
        <Button type="Submit">Submit</Button>
      </Form>
    </>
  );
}

OrderForm.propTypes = {
  orderObj: PropTypes.shape({
    id: PropTypes.number,
    uid: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    orderType: PropTypes.bool,
    paymentTypeId: PropTypes.number,
  }),
};

OrderForm.defaultProps = {
  orderObj: PropTypes.shape({
    id: 0,
    uid: '',
    name: '',
    email: '',
    phone: '',
    orderType: false,
    paymentTypeId: 1,
  }),
};
