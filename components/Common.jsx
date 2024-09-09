const HomePageation = ({ currentPage, setCurrentPage, totalPages }) => (
  <div className="p-3 m-8 flex-center">
    <Pagination
      page={currentPage}
      onChange={setCurrentPage}
      total={totalPages}
    />
  </div>
);

export { HomePageation };
