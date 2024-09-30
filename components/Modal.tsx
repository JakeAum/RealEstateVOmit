"use client";
import { useState } from "react";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedData: any | null;
}

const Modal = ({ isModalOpen, setIsModalOpen, selectedData }: ModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showScrapedData, setShowScrapedData] = useState(false);
  const [scrapedData, setScrapedData] = useState<{
    ownerInformation: string[];
    propertyInformation: string[];
    legalInformation: string[];
  } | null>(null);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    setIsLoading(true);
    if (!selectedData || !selectedData.ACCOUNT) {
      console.error("No account selected");
      setIsLoading(false);
      return;
    }
    try {
      // First API call to scrape data
      const scrapeResponse = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parcelId: selectedData.ACCOUNT }),
      });

      if (!scrapeResponse.ok) {
        throw new Error(`HTTP error! status: ${scrapeResponse.status}`);
      }

      const scrapedData = await scrapeResponse.json();
      console.log("Scraping successful:", scrapedData);

      setScrapedData(scrapedData);
      setShowScrapedData(true);

      // Second API call to overlay information on the contract
      const addressString = `${selectedData?.STANDARD}`.trim();
      const cityString =
        `${selectedData?.POSTOFFICE}, FL, ${selectedData?.ZIPCODE}`.trim();
      const overlayResponse = await fetch("/api/overlay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...scrapedData,
          address: addressString,
          city: cityString,
        }),
      });

      if (!overlayResponse.ok) {
        const errorText = await overlayResponse.text();
        throw new Error(
          `HTTP error! status: ${overlayResponse.status}, message: ${errorText}`
        );
      }

      const overlayBlob = await overlayResponse.blob();
      const overlayUrl = URL.createObjectURL(overlayBlob);
      setOverlayImage(overlayUrl);

      setIsLoading(false);
    } catch (error) {
      console.error("Error processing data:", error);
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };


  const handleDownloadClick = async () => {
    if (!overlayImage) {
      console.error("No overlay image available");
      setErrorMessage("No overlay image available");
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Convert blob URL to base64
      const response = await fetch(overlayImage);
      const blob = await response.blob();
      const reader = new FileReader();
      const base64Image = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
  
      // Make an API request to generate the PDF
      const apiResponse = await fetch("/api/download-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: base64Image,
          accountId: selectedData?.ACCOUNT,
          addy: selectedData?.STANDARD
        }),
      });
  
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.message || `HTTP error! status: ${apiResponse.status}`);
      }
  
      const pdfBlob = await apiResponse.blob();
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${selectedData?.STANDARD}_${selectedData?.ACCOUNT}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowScrapedData(false);

    setScrapedData(null);
    setOverlayImage(null);
    setErrorMessage(null);

    setIsModalOpen(false);
  };

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />{" "}
          {/* Darker overlay */}
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full overflow-hidden items-start md:items-center justify-center p-2">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-3xl h-full overflow-visible transform text-left align-middle shadow-xl transition-all rounded-xl bg-base-100 p-6 md:p-8">
                <div className="flex justify-between items-center mb-4 w-[60vw]">
                  <Dialog.Title as="h2" className="text-xl font-semibold">
                    {selectedData?.STANDARD +
                      " " +
                      selectedData?.POSTOFFICE +
                      " " +
                      selectedData?.ZIPCODE}
                  </Dialog.Title>
                  <button
                    className="btn btn-square btn-ghost btn-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </div>

                <section className="overflow-y-auto max-h-[60vh]">
                  {selectedData ? (
                    <div>
                      <strong>Property ID: </strong>{" "}
                      <a
                        href={`https://www.ccappraiser.com/Show_parcel.asp?acct=${selectedData.ACCOUNT}&gen=T&tax=T&bld=F&oth=T&sal=T&lnd=F&leg=T`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {selectedData.ACCOUNT}
                      </a>
                    </div>
                  ) : (
                    <p>No data selected</p>
                  )}
                </section>

                {showScrapedData && scrapedData ? (
                  <section className="flex flex-col py-4 space-y-4 overflow-y-auto max-h-[60vh]">
                    <ul>
                      {scrapedData.ownerInformation.map((info, index) => (
                        <li key={index}>{info}</li>
                      ))}
                    </ul>

                    <ul>
                      {scrapedData.propertyInformation.map((info, index) => (
                        <li key={index}>{info}</li>
                      ))}
                    </ul>

                    <ul>
                      {scrapedData.legalInformation.map((info, index) => (
                        <li key={index}>{info}</li>
                      ))}
                    </ul>
                  </section>
                ) : (
                  <div className="flex justify-center w-full">
                    {/* text before user clicks btn */}
                  </div>
                )}

                {overlayImage && (
                  <div>
                    <div role="alert" className="alert alert-success">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        Document Generated Succesfully, please validate then
                        download PDF.
                      </span>
                    </div>
                    <img
                      src={overlayImage}
                      alt="Overlay Result"
                      style={{ maxWidth: "100%" }}
                    />
                  </div>
                )}

                {errorMessage ? (
                  <div role="alert" className="alert alert-error mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 shrink-0 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>We encountered an error: {errorMessage}</span>
                  </div>
                ) : (
                  <div />
                )}

                <section className="mt-2 flex flex-row justify-center space-x-4">
                  {!overlayImage ? (
                    <button
                      onClick={handleGenerateClick}
                      className="btn btn-primary btn-wide"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-md"></span>
                      ) : (
                        "Generate"
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setOverlayImage(null)}
                        className="btn btn-primary btn-wide"
                      >
                        Re-Generate
                      </button>
                      <button
                        className="btn btn-secondary btn-wide"
                        onClick={handleDownloadClick}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                        <span className="loading loading-spinner loading-md"></span>
                      ) : (
                        "Download PDF"
                      )}
                    </button>
                    </>
                  )}
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
