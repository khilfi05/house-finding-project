interface Listing {
    _id: string
    title: string
    price: number
    description: string
    furnished: boolean
    walkingToMonash: number
    walkingToBusStop: number
    sourceURL: string
    imageURL: string
    lat: number
    lon: number
};

export default Listing
