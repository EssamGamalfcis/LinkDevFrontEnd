<style>
.p-dropdown.p-component {
  display: flex !important;
}
table,
td {
  text-align: left !important;
}
.p-datatable-emptymessage {
  position: relative;
  right: -42%;
}
.border-danger {
  border-color: rgb(255, 0, 0) !important;
}
body .p-button.p-button-text-icon-left .p-button-text {
  padding: 0.229em 1em 0.229em 2.25em !important;
}
.stposto {
  position: relative;
}
.stposto span {
  display: none;
}
.stposto .border-danger ~ span {
  position: absolute;
  color: rgb(249 60 53);
  z-index: 99;
  left: 17;
  top: 0px;
  font-size: 18px;
  display: block !important;
}
.p-paginator .p-dropdown {
  width: 20%;
  float: right;
}
.p-datatable-header {
  height: 53px;
}
body .p-datatable .p-datatable-header {
  margin-bottom: 0 !important;
  padding: 0 !important;
}
</style>

<template>
  <div>
    <Toast position="top-right" />
    <div class="col-12 mt-2" style="position: absolute">
      <h4 class="font-weight-bold hfontsize">Book Branch</h4>
    </div>
    <div>
      <LogOutComp />
    </div>

    <template>
      <div class="container mt-5">
        <div class="row mt-5">
          <div class="col-12" style="margin-top: 14%">
            <DataTable
              :value="listOfObjects"
              :paginator="true"
              :rows="3"
              responsiveLayout="scroll"
              :lazy="true"
              :totalRecords="totalRecords"
              :loading="loading"
              ref="dt"
              @page="OnPage($event)"
              :rowsPerPageOptions="[3, 6, 9, 18, 50]"
              paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate=""
            >
              <template #empty style="margin-righ: 50% !important">
                No branches found
              </template>
              <template #header>
                <div class="float-left mb-2">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText
                      v-model="filters['global'].value"
                      placeholder="Search"
                      @input="OnFilter()"
                    />
                  </span>
                </div>
              </template>
              <Column field="title" header="Title"></Column>
              <Column header="Opening Hour">
                <template #body="slotProps">
                  <span class=""> {{ slotProps.data.openingHourString }}</span>
                </template>
              </Column>
              <Column header="Closing Hour">
                <template #body="slotProps">
                  <span class=""> {{ slotProps.data.closingHourString }}</span>
                </template>
              </Column>
              <Column field="managerName" header="Manager Name"></Column>
              <Column
                columnKey="actions"
                headerStyle="width: 8em"
                header="Book"
                bodyStyle="display: flex;"
              >
                <template #body="slotProps">
                  <Button
                    label="Book"
                    v-if="slotProps.data.canBook == true"
                    @click="Book(slotProps.data.id)"
                    icon="pi pi-check"
                    class="p-button-sm"
                  />
                  <Button
                    label="Book"
                    disabled
                    v-if="slotProps.data.canBook == false"
                    icon="pi pi-check"
                    class="p-button-sm"
                  />
                </template>
              </Column>
              <template #paginatorstart>
                <Button
                  type="button"
                  icon="pi pi-refresh"
                  class="p-button-text"
                />
              </template>
              <template #paginatorend>
                <Button
                  type="button"
                  icon="pi pi-cloud"
                  class="p-button-text"
                />
              </template>
            </DataTable>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>


<script>
import service from "../API/ApiServicesCall";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Toast from "primevue/toast";
import LogOutComp from "../components/AuthLayout.vue";

import "bootstrap";
import "bootstrap-vue";
export default {
  name: "Branches_Setup",
  data() {
    return {
      loading: false,
      lazyParams: {},
      totalRecords: 0,
      obj: {
        branchId: 0,
        userId: localStorage.getItem("userId"),
      },
      listOfObjects: [],
      error: {},
      deleteDialog: false,
      isVisibleCancelEditBtn: false,
      addOrEditText: "Add",
      filters: {},
      idToDelete: 0,
    };
  },
  components: {
    Calendar,
    InputText,
    DataTable,
    Column,
    Dialog,
    Button,
    Toast,
    LogOutComp,
  },
  methods: {
    LoadLazyData() {
      this.loading = true;
      var url =
        "UserBranchBooking/GetAllBranches?first=" +
        (typeof this.lazyParams.first != "undefined"
          ? this.lazyParams.first
          : 3) +
        "&page=" +
        (typeof this.lazyParams.page != "undefined"
          ? this.lazyParams.page
          : 0) +
        "&pageCount=" +
        (typeof this.lazyParams.pageCount != "undefined"
          ? this.lazyParams.pageCount
          : 0) +
        "&rows=" +
        (typeof this.lazyParams.rows != "undefined"
          ? this.lazyParams.rows
          : 0) +
        "&userId=" +
        localStorage.getItem("userId") +
        "&gloabalText=" +
        (typeof this.lazyParams.filters != "undefined" &&
        typeof this.lazyParams.filters["global"] != "undefined" &&
        this.lazyParams.filters["global"].value != null &&
        this.lazyParams.filters["global"].value != ""
          ? this.lazyParams.filters["global"].value
          : null);
      service
        .GetCallService(url)
        .then((res) => {
          this.listOfObjects = res.data.data;
          this.totalRecords = res.data.totalCount;
          this.loading = false;
          var elems = document.querySelectorAll(".p-datatable-wrapper");
          elems.forEach.call(elems, function (el) {
            el.classList.remove("p-datatable-wrapper");
          });
          var elems = document.querySelectorAll(".p-component");
          setTimeout(() => {
            elems[14].classList.remove("p-component");
          }, 50);
        })
        .catch((err) => {
          this.error = err;
        });
    },

    OnPage(event) {
      this.lazyParams = event;
      this.LoadLazyData();
    },
    OnFilter() {
      this.lazyParams.filters = this.filters;
      this.LoadLazyData();
    },
    Book(branchId) {
      this.obj.branchId = branchId;
      service
        .PostCallService("UserBranchBooking/BookBranch", this.obj)
        .then((res) => {
          this.$toast.add({
            severity: "success",
            summary: res.data.message,
            life: 3000,
          });
          this.LoadLazyData();
        })
        .catch((err) => {
          this.$toast.add({
            severity: "error",
            summary: err.data.message,
            life: 3000,
          });
        });
    },
    InitFilters() {
      this.filters = {
        global: { value: null },
      };
    },
  },

  created() {
    this.LoadLazyData();
    this.InitFilters();
  },
  mounted() {
    this.lazyParams = {
      first: 0,
      rows: this.$refs.dt.rows,
      page: 0,
      pageCount: 0,
      filters: this.filters,
    };
  },
};
</script>