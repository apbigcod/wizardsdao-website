import { useEffect, useState } from "react";
import { useKeyPress } from "../../hooks/useKeyPress";
import { useRouter } from "next/router";
import { useContractFunction } from "@usedapp/core";
import { ethers } from "ethers";
import AuctionTimer from "./auctionTimer";
import useAuctionHouseSubscriber from "../../hooks/useAuctionHouseSubscriber";
import BigNumber from "bignumber.js";
import AuctionInput from "./auctionInput";
import { TailSpin } from "../loader";
import UpForAuctionNav from "./upForAuctionNav.js";
import BidHistory from "./bidHistory.js";
import { pageState as state, onUpdate } from "../../lib/auction/pageState";

const AUCTION_COUNT = 3;

let minBidIncPercentage = new BigNumber(5);
const computeMinimumNextBid = (currentBid, minBidIncPercentage) => {
  if (currentBid.isZero()) {
    return new BigNumber(0);
  }

  return !minBidIncPercentage
    ? new BigNumber.from(0)
    : currentBid.times(minBidIncPercentage.div(100).plus(1));
};

const minBidEth = (minBid) => {
  if (minBid.toString() == "NaN") {
    minBid = new BigNumber(0);
  }
  if (minBid.isZero()) {
    return "0.07";
  }

  const eth = Number(
    ethers.utils.formatEther(ethers.BigNumber.from(minBid.toFixed()))
  );

  const roundedEth = Math.ceil(eth * 100) / 100;
  return roundedEth.toString();
};

function useQuery(router) {
  const hasQueryParams =
    /\[.+\]/.test(router.route) || /\?./.test(router.asPath);
  const ready = !hasQueryParams || Object.keys(router.query).length > 0;
  if (!ready) return {};
  return router.query;
}

const colors = (bg) => {
  const values = {
    0: "#c5a3e2", // purple,
    1: "#a4addd", // blue
    2: "#e0a4ad", // red
  };

  return values[bg];
};

const setBg = (bg) => {
  const aWrapper = document.querySelector(".auction-wrapper");
  const header = document.querySelector("header");
  const color = colors(bg);
  header.style.background = color;
  aWrapper.style.background = color;
};

let npid, ppid;
const Auction = ({ web3React }) => {
  const router = useRouter();
  const query = useQuery(router);

  // subscribe to auction house events
  const [
    bidEvents,
    createdEvents,
    extendedEvents,
    settledEvents,
    auctionHouse,
    wizardToken,
    setTimerLength,
    dispatchBidEvents,
    poll,
    paused,
    loading,
  ] = useAuctionHouseSubscriber();

  const [pageState, setPageState] = useState(state);
  const [bidError, setBidError] = useState("");
  const [restartAuction, setRestartAuction] = useState(false);

  useEffect(() => {
    if (settledEvents.length == AUCTION_COUNT && !restartAuction) {
      setRestartAuction(true);
    }
  }, [JSON.stringify(settledEvents)]);

  useEffect(() => {
    const fn = async () => {
      const events = {
        createdEvents,
        bidEvents,
        extendedEvents,
        settledEvents,
        wizardToken,
      };

      const ps = await onUpdate(events, wizardToken, query, { ...pageState });
      npid = ps.nextPageId;
      ppid = ps.previousPageId;

      setBg(ps.bg);
      setPageState(ps);
    };

    try {
      fn();
    } catch (ex) {
      ps.globalError = "Could not connect to the Ethereum network";
    }
  }, [
    JSON.stringify(query.id),
    JSON.stringify(createdEvents),
    JSON.stringify(bidEvents),
    JSON.stringify(extendedEvents),
    JSON.stringify(pageState),
    paused,
    restartAuction,
    loading,
  ]);

  const {
    wizards,
    wizard,
    imageLoading,
    globalError,
    nextPageId,
    previousPageId,
  } = pageState;
  if (!wizard.bids) wizard.bids = [];

  // handle key bindings
  useKeyPress("ArrowLeft", () => {
    router.push(`/auction/${ppid}`);
  });

  useKeyPress("ArrowRight", () => {
    router.push(`/auction/${npid}`);
  });

  return (
    <>
      {(() => {
        if (globalError) {
          return (
            <div className="g-error">
              <p>{globalError}</p>
            </div>
          );
        }
      })()}
      <div className="auction-wrapper">
        <div className="container-xl">
          <UpForAuctionNav
            query={query}
            wizards={wizards}
            nextPage={nextPageId}
            previousPage={previousPageId}
          />
          <div className="row">
            <div className="col-lg-6" style={{ display: "flex" }}>
              <div className="wizard-img-wrapper">
                <div className="img-inner">
                  {loading || imageLoading ? (
                    <TailSpin className="lspinner" />
                  ) : null}
                  <img
                    alt={wizard.dataURI?.description}
                    className="wizard-img"
                    src={wizard.dataURI?.image}
                  />
                </div>
              </div>
            </div>
            {(() => {
              return (
                <div className="col-lg-6 activity">
                  <div className="row">
                    <h2>Wizard #{wizard.wizardId}</h2>
                  </div>
                  <div className="row information">
                    <div
                      className="col-md-4 m-sbs"
                      style={{
                        borderRight:
                          "1px solid rgba(121,128,156,.28627450980392155)",
                      }}
                    >
                      <h4>Current bid</h4>
                      <h2>
                        <span style={{ fontFamily: "sans-serif" }}>{"Ξ "}</span>
                        {ethers.utils.formatEther(
                          wizard.lastBid || ethers.BigNumber.from("0")
                        )}
                      </h2>
                    </div>
                    <div className="col-md-8 m-sbs pl">
                      <h4>{wizard.ended ? "Auction ended" : "Ends in"}</h4>
                      <h2>
                        <AuctionTimer wizard={wizard} />
                      </h2>
                    </div>
                  </div>
                  <div className="row">
                    <AuctionInput
                      paused={paused}
                      wizards={wizards}
                      poll={poll}
                      dispatchBidEvents={dispatchBidEvents}
                      bidError={bidError}
                      auctionHouse={auctionHouse}
                      web3React={web3React}
                      wizard={wizard}
                      minBidEth={minBidEth(
                        computeMinimumNextBid(
                          BigNumber(wizard.lastBid || new BigNumber(0)),
                          minBidIncPercentage
                        )
                      )}
                      setBidError={setBidError}
                    />
                  </div>
                  <BidHistory wizard={wizard} web3React={web3React} />
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      <style jsx>{`
        h2 {
          font-size: 2.16rem;
        }
        .activity {
          padding-right: 5rem;
          padding-bottom: 0;
          min-height: 510px;
          align-self: flex-end !important;
          color: #212121;
        }
        .activity h3,
        .activity h4 {
          opacity: 0.65;
        }
        .wizard-img-wrapper {
          width: 100%;
          align-self: flex-end;
        }
        .img-inner {
          position: relative;
          padding-top: 100%;
          width: 100%;
          height: 0;
        }
        .wizard-img {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: auto;
          vertical-align: middle;
        }

        .m-sbs h2 {
          margin-top: -10px;
        }

        .information {
          margin-bottom: 10px;
        }

        .pl {
          padding-left: 2.5rem;
        }

        @media (max-width: 568px) {
          .pl {
            padding: 0;
          }

          .activity {
            padding-right: calc(var(--bs-gutter-x) * 0.5);
            background: #12004c;
            color: #f0f0f0;
            padding: 0.16rem 15px;
            min-height: auto;
          }

          .m-sbs {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0;
          }

          .m-sbs h2 {
            font-size: 23px;
            line-height: 36px;
            margin-bottom: 0;
          }

          .information {
            margin: 0 0 0.9rem 0;
          }
        }
      `}</style>
      <style jsx global>{`
        .lspinner {
          position: absolute;
          z-index: 999;
          top: 0;
          right: 0;
          width: 20px;
        }
      `}</style>
    </>
  );
};

export default Auction;
