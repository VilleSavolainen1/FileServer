import  secureLocalStorage  from  "react-secure-storage"

export const storeValueForKey = (key: string, value: string) => {
    secureLocalStorage.setItem(key, value);
}

export const deleteValueForKey = (key: string) => {
    secureLocalStorage.removeItem(key)
}

export const getValueForKey = (key: string) => {
    return secureLocalStorage.getItem(key)
}

export const clearStorage = () => {
    secureLocalStorage.clear()
}