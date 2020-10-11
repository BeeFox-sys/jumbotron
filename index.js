var source = new EventSource("https://cors-proxy.blaseball-reference.com/events/streamData");
let day = 0
let gameID;


source.onmessage = (event) => {
    let data = JSON.parse(event.data);
    let schedule = data.value.games.schedule

    let gameNames = schedule.map(g => {return {name: `${g.awayTeamNickname} @ ${g.homeTeamNickname}`, id: g.id}});

    if(data.value.games.sim.day > day){
        document.querySelector(".game-select").innerHTML = "";
        gameNames.forEach(game => {
            let option = document.createElement("option")
            option.setAttribute("value", game.id)
            option.innerText = game.name
            document.querySelector(".game-select").appendChild(option)
        });
        day = data.value.games.sim.day;
        gameID = document.querySelector(".game-select").value;
    }
    let game = schedule.find(g=>g.id==gameID);
    if(game){
        document.querySelector(".homeName").innerText = game.homeTeamNickname
        document.querySelector(".homeName").setAttribute("style",`color:${game.homeTeamColor}`)
        document.querySelector(".awayName").innerText = game.awayTeamNickname
        document.querySelector(".awayName").setAttribute("style",`color:${game.awayTeamColor}`)

        let bases = "".padStart(game.topOfInning ? game.awayBases-1 : game.homeBases-1,"⬛")
        for (const base of game.basesOccupied) {
            bases = bases.substr(0, base) + "⬜" + bases.substr(base + 1)
        }
        let balls = "".padStart(game.atBatBalls, "⚪").padStart(3,"⚫");
        let strikes = "".padStart(game.atBatStrikes, "⚪").padStart(2,"⚫");
        let outs = "".padStart(game.halfInningOuts, "⚪").padStart(3,"⚫");

        document.querySelector(".infobox").innerHTML = `<span class=bases>${bases}</span>${balls}<br>${strikes}<br>${outs}`
        document.querySelector(".homeScore").innerText = game.homeScore
        document.querySelector(".awayScore").innerText = game.awayScore
        document.querySelector(".gameData").innerText = game.lastUpdate
    }
};