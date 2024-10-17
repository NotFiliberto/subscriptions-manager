export default async function CatFact() {
    const catFactResponse = await fetch("https://catfact.ninja/fact", {
        // small note - next.js will cache the cat fact, which we can turn off
        cache: "no-store",
    })
    const catFactJson = await catFactResponse.json()
    return <div>{catFactJson["fact"]}</div>
}
