import GamesDisplay from "../GamesDisplay";

const Games = () => {
  return (
    <div className="items-container">
      <h1>Games</h1>
      <div className={"items-wrapper"}>
        <GamesDisplay />
      </div>
    </div>
  );
};

export default Games;
