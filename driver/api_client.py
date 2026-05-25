import requests

def fetch_photo(url):
    try:
        response = requests.get(url)
        
        if response.status_code == 200:
            image_data = response.content
        else:
            image_data = None
            
        response.close()
        return image_data

    except Exception as e:
        print("Wystąpił błąd sieci lub pamięci:", e)
        return None

def fetch_ocr(buff, backend_url):
    headers = {
        'Content-Type': 'application/json',
        'Content-Length': str(len(buff)) 
    }
    try:
        post_resp = requests.post(backend_url, headers=headers, data=buff)
        response_data = None
        
        if post_resp.status_code == 200:
            print("Sukces! Backend przyjął zdjęcie i zwrócił 200 OK.")
            response_data = post_resp.text
        else:
            print(f"Błąd backendu, kod HTTP: {post_resp.status_code}")
            print(f"Treść błędu z serwera: {post_resp.text}")
            
        post_resp.close()
        
    except Exception as e:
        print(f"!!! BŁĄD KRYTYCZNY PRZY WYSYŁANIU: {e}")
        return None
    
    return response_data