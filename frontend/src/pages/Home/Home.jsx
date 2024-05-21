import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaExternalLinkAlt } from 'react-icons/fa';

import { useTitle } from '../../hooks/useTitle';
import Spinner from '../../components/Loading/Loading';
import './styles.css';
import PageHeading from '../../components/PageHeading/PageHeading';
import { calculators } from './calculators';

const Home = () => {
	useTitle('Home');
	const { isLoading } = useSelector((state) => state.auth);

	return (
		<>
			{isLoading && <Spinner />}

			<div className="calculator-container">
				{calculators.map((calculator, i) => (
					<Link
						key={`calculator-${i}`}
						className="calculator-card"
						to={`/${calculator.url}`}
					>
						<div>
							<h2>{calculator.name}</h2>
							<hr />
							<p>{calculator.description}</p>
						</div>
					</Link>
				))}
			</div>
		</>
	);
};

export default Home;
