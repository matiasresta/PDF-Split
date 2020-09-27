from PyPDF2 import PdfFileWriter, PdfFileReader

def one_split(file, page, name):
    page = page - 1
    pdfFileObj = open(file + ".pdf", 'rb')
    pdfReader = PdfFileReader(pdfFileObj)
    output = PdfFileWriter()
    output.addPage(pdfReader.getPage(page))
    with open(name + ".pdf", "wb") as outputStream:
        output.write(outputStream)

def multiple_split(file, pages, name):
    pages[0], pages[1] = int(pages[0]) - 1, int(pages[1])
    pdfFileObj = open(file + ".pdf", 'rb')
    pdfReader = PdfFileReader(pdfFileObj)
    output = PdfFileWriter()
    for i in range(pages[0], pages[1]):
        output.addPage(pdfReader.getPage(i))
    with open(name + ".pdf", "wb") as outputStream:
        output.write(outputStream)

while True:
    file = input("Dime el nombre del PDF que queres separar: ")
    page = input("Dime el numero de la página (INT) que queres separar o el rango de paginas (INT-INT): ")
    try:
        page = int(page)
        name = input("Dime el nombre del nuevo PDF quieres tener: ")
        one_split(file, page, name)
        print("Éxito...")
        print()
        action = input("Queres seguir? (Y/N)").lower()
        if action == "n":
            break
    except:
        try:
            page = page.split("-")
        except:
            pass
        name = input("Dime el nombre del nuevo PDF quieres tener: ")
        multiple_split(file, page, name)
        print("Éxito...")
        print()
        action = input("Queres seguir? (Y/N)").lower()
        if action == "n":
            break
        else:
            pass

        pass
