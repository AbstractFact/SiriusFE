import AbstractView from "./AbstractView.js";
import {Series} from "../models/Series.js";
import {Actor} from "../models/Actor.js";
import {Role} from "../models/Role.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.setTitle("Viewing Series");
    }

    async getHtml() 
    {
        var html,i;

        await fetch("https://localhost:44365/Series/GetSeries/"+this.postId, {method: "GET"})
        .then(p => p.json().then(d => {
                
                const series = new Series(d[0]["id"], d[0]["title"], d[0]["year"], d[0]["genre"], d[0]["plot"], d[0]["seasons"], d[0]["rating"]);
                html=`
                    <h1>Series: ${series.title}</h1>
                    <br/>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">Year</th>
                            <th scope="col">Genre</th>
                            <th scope="col">Plot</th>
                            <th scope="col">Seasons</th>
                            <th scope="col">Rating</th>
                            </tr>
                        </thead>
                        <tbody>`;

                    html+=`
                        <tr>
                        <td>${series.year}</td>
                        <td>${series.genre}</td>
                        <td>${series.plot}</td>
                        <td>${series.seasons}</td>
                        <td>`+ +(Math.round(series.rating + "e+1") + "e-1")+`</td>
                        </tr>`;

                    html+=`
                        </tbody>
                        </table>
                        <p>
                            <a href="/series" data-link>Add series to your list</a>.
                        </p>
                        <p>
                            ${series.plot}
                        </p>
                        <br/>`;
        }));


        await fetch("https://localhost:44365/Role/GetSeriesRoles/"+this.postId, {method: "GET"})
        .then(p => p.json().then(d => {
                i=0;

                html+=`
                    <h2>Cast</h1>
                    <br/>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Role</th>
                            <th scope="col">Actor</th>
                            </tr>
                        </thead>
                        <tbody>`;

                d.forEach(data => {

                    const actor = new Actor(data["actor"]["id"], data["actor"]["name"], data["actor"]["birthplace"], data["actor"]["birthday"], data["actor"]["biography"]);
                    const series = new Series(data["series"]["id"], data["series"]["title"], data["series"]["year"], data["series"]["genre"], data["series"]["plot"], data["series"]["seasons"], data["series"]["rating"]);
                    const role = new Role(data["id"], actor, series, data["inRole"]);

                    html+=`
                        <tr>
                        <th scope="row">${++i}</th>
                        <td>${role.inrole}</td>
                        <td><a href="/actors/${role.actor.id}" data-link>${role.actor.name}</a></td>
                        </tr>`;
                });
        }));

        return html;


        // //     const prodavnica = new Prodavnica(d["ime"], d["id"]);
        // //     d["proizvodi"].forEach(pr =>{
        // //         prodavnica.dodajProizvod(new Proizvod(pr["id"],pr["sifra"],
        // //         pr["ime"],pr["cena"],pr["kolicina"]));
        // //     });
        // //     prodavnica.crtaj(document.body);
        // });
    }
}
