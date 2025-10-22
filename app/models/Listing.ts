interface Listing {
    _id: string
    title: string
    mapLink: string
    price: number
    description: string
    furnished: boolean
    walkingToMonash: number
    walkingToBusStop: number
    sourceURL: string
    imageURL: string
    lat: number
    lon: number
    additionalDetails: string
    color: string
};

export default Listing
