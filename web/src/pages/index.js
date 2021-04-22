import React, { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
import useInterval from "@use-it/interval";
import axios from "axios";

import CatImg from "../images/cat.svg";
import DogImg from "../images/dog.svg";
import GreenImg from "../images/green.svg";
import RedImg from "../images/red.svg";
import WhiteRenderLogoImg from "../images/render-logo-color-white.svg";

const VoteResult = ({ countFor, countAgainst }) => {
  const total = countFor + countAgainst;
  const pct = total > 0 ? Math.round((countFor / total) * 100) : "--";
  const count = total > 0 ? countFor : "--";
  return (
    <div>
      <h2 className="temp-h2">{pct}%</h2>
      <div className="temp-p">{count} Votes</div>
    </div>
  );
};

const IndexPage = ({ location }) => {
  const data = useStaticQuery(graphql`
    query PageInfoQuery {
      allStrapiPageInfo {
        edges {
          node {
            title
            prompt
          }
        }
      }
    }
  `);
  const { title, prompt } = data.allStrapiPageInfo.edges[0].node;

  const votesEndpoint =
    process.env.GATSBY_ENV === "development"
      ? "http://localhost:1337/votes"
      : `${location.origin}/api/votes`;

  const [{ cats, dogs }, setVotes] = useState({ cats: 0, dogs: 0 });

  const fetchAndSetVotes = async () => {
    const catVotes = await axios(`${votesEndpoint}/count?option=cats`);
    const dogVotes = await axios(`${votesEndpoint}/count?option=dogs`);
    setVotes({ cats: catVotes.data, dogs: dogVotes.data });
  };

  const castVote = async (option) => {
    await axios.post(votesEndpoint, { option });
    await fetchAndSetVotes();
  };

  useEffect(fetchAndSetVotes, []);
  useInterval(fetchAndSetVotes, 1000);

  return (
    <section className="temp-section">
      <img src={GreenImg} alt="" className="temp-img temp-img-green" />
      <img src={RedImg} alt="" className="temp-img temp-img-pink" />
      <a href="http://www.render.com" className="temp-logo-link w-inline-block">
        <img src={WhiteRenderLogoImg} alt="" className="temp-logo" />
      </a>
      <div className="temp-container-center">
        <h2 className="temp-h1">{title}</h2>
        <h5 className="temp-subhead">
          Deployed on{" "}
          <a href="http://www.render.com" className="temp-link">
            Render
          </a>
        </h5>
        <div className="temp-card-container">
          <div className="temp-card">
            <div>
              <h2 className="temp-h3">Dogs Rule</h2>
              <div
                aria-hidden
                className="temp-card-button temp-blue"
                onClick={() => castVote("dogs")}
                role="button"
              >
                <img src={DogImg} loading="lazy" alt="" className="temp-icon" />
                <h2 className="temp-button-text">Vote</h2>
              </div>
              <VoteResult countFor={dogs} countAgainst={cats} />
            </div>
          </div>
          <div className="temp-card">
            <div>
              <h2 className="temp-h3">Cats Reign</h2>
              <div
                aria-hidden
                className="temp-card-button temp-red"
                onClick={() => castVote("cats")}
                role="button"
              >
                <img src={CatImg} loading="lazy" alt="" className="temp-icon" />
                <h2 className="temp-button-text">Vote</h2>
              </div>
              <VoteResult countFor={cats} countAgainst={dogs} />
            </div>
          </div>
        </div>
        <div className="temp-p temp-centered">{prompt}</div>
      </div>
    </section>
  );
};

export default IndexPage;
