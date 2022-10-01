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
    <div>
      <LogOutComp />
    </div>
    <template>
      <div class="container mt-4">
        <div class="row">
          <div class="col-12">
            <h4 class="font-weight-bold hfontsize">
              <i class="newflaticon-cost-2 styleicons"></i>Branches Setup
            </h4>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-2">
            <label for="managerName" style="float: left">Title</label>
            <InputText
              type="text"
              v-model="obj.title"
              class="form-control"
              placeholder="title"
              :class="[
                obj.title == null || obj.title == ''
                  ? 'border border-danger'
                  : '',
              ]"
            />
          </div>
          <div class="col-2">
            <label for="managerName" style="float: left">Opening Hour</label>
            <Calendar
              v-model="obj.openingHour"
              :showTime="true"
              hourFormat="12"
              :timeOnly="true"
              :show-icon="true"
              :stepMinute="30"
              @input="FormatAMPM(obj.openingHour, 1)"
              :class="[
                obj.openingHour == null || obj.openingHour == ''
                  ? 'border border-danger'
                  : '',
              ]"
              placeholder="opening hour"
            />
          </div>
          <div class="col-2">
            <label for="managerName" style="float: left">Closing Hour</label>
            <Calendar
              v-model="obj.closingHour"
              :showTime="true"
              hourFormat="12"
              :timeOnly="true"
              :show-icon="true"
              :stepMinute="30"
              @input="FormatAMPM(obj.closingHour, 2)"
              :class="[
                obj.closingHour == null ||
                obj.closingHour == '' ||
                obj.closingHour < obj.openingHour
                  ? 'border border-danger'
                  : '',
              ]"
              placeholder="opening hour"
            />
          </div>
          <div class="col-2">
            <label for="managerName" style="float: left">Manager Name</label>
            <InputText
              type="text"
              id="managerName"
              v-model="obj.managerName"
              class="form-control"
              placeholder="manager name"
              :class="[
                obj.managerName == null || obj.managerName == ''
                  ? 'border border-danger'
                  : '',
              ]"
            />
          </div>
          <div class="col-4 d-flex" style="margin-top: 33px">
            <Button
              style="height: 36px"
              id="AddOrUpdateBtn"
              @click="AddOrUpdate()"
              :label="addOrEditText"
            />
            <Button
              v-if="isVisibleCancelEditBtn"
              style="height: 36px; margin-left: 16px"
              class="p-button-danger"
              id="CancelUpdateBtn"
              @click="CancelEdit()"
              label="Cancel"
            />
          </div>
        </div>
      </div>
    </template>
    <template>
      <div class="container">
        <div class="row mt-5">
          <div class="col-12">
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
                header="Update/Delete"
                bodyStyle="display: flex;"
              >
                <template #body="slotProps">
                  <a
                    class="icon styleedite"
                    style="position: absolute; right: 209px; margin-top: -10px"
                    @click="Edit(slotProps.data)"
                  >
                    <i class="pi pi-pencil"></i>
                  </a>
                  <a
                    class="icon styledelete"
                    style="position: absolute; right: 156px; margin-top: -10px"
                    @click="Delete(slotProps.data.id)"
                  >
                    <i class="pi pi-trash"></i>
                  </a>
                  <Dialog
                    :visible.sync="deleteDialog"
                    :breakpoints="{ '960px': '75vw' }"
                    :style="{ width: '300px' }"
                    :modal="true"
                    class="styledial"
                  >
                    <template #header> Delete </template>
                    <div class="container-fluid">
                      <div class="row">
                        <h5>Confirm</h5>
                      </div>
                    </div>
                    <template #footer>
                      <Button
                        label="Ok"
                        icon="pi pi-check"
                        autofocus
                        @click="ConfirmDelete()"
                      />
                      <Button
                        label="Cancel"
                        icon="pi pi-times"
                        class="cancelstyle p-button-danger"
                        @click="CancelDelete()"
                      />
                    </template>
                  </Dialog>
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
        id: 0,
        closingHour: new Date(new Date().setHours(0, 30, 0, 0)),
        openingHour: new Date(new Date().setHours(0, 0, 0, 0)),
        openingHourString: "null",
        closingHourString: "null",
        title: null,
        managerName: null,
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
        "Branch/GetAllBranches?first=" +
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
        "&userId=" + localStorage.getItem("userId") +
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
    FormatAMPM(date, calendarNumber) {
      if (this.obj.id != 0) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime =
          (hours < 10 ? "0" + hours : hours) + ":" + minutes + " " + ampm;
        if (calendarNumber == 1) {
          this.obj.openingHourString = strTime;
        } else {
          this.obj.closingHourString = strTime;
        }
      }
    },
    OnPage(event) {
      this.lazyParams = event;
      this.LoadLazyData();
    },
    OnFilter() {
      this.lazyParams.filters = this.filters;
      this.LoadLazyData();
    },
    Edit(unit) {
      if (unit) {
        this.obj = unit;
        this.obj.closingHour = new Date(this.obj.closingHour);
        this.obj.openingHour = new Date(this.obj.openingHour);
        this.addOrEditText = "Update";
        this.isVisibleCancelEditBtn = true;
      }
    },
    CancelEdit() {
      this.obj.closingHour = new Date(new Date().setHours(0, 30, 0, 0));
      this.obj.openingHour = new Date(new Date().setHours(0, 0, 0, 0));
      this.obj.id = 0;
      this.obj.title = null;
      this.obj.managerName = null;
      this.isVisibleCancelEditBtn = false;
      this.addOrEditText = "Add";
      this.LoadLazyData();
    },
    Delete(id) {
      this.idToDelete = id;
      this.deleteDialog = true;
    },
    ConfirmDelete() {
      if (this.idToDelete != 0) {
        service
          .PostCallService("Branch/DeleteBranch", this.idToDelete)
          .then((res) => {
            this.$toast.add({
              severity: "success",
              summary: res.data.message,
              life: 3000,
            });
            this.LoadLazyData();
          })
          .catch((err) => {
            this.error = err;
          });
      }
      this.deleteDialog = false;
    },
    CancelDelete() {
      this.deleteDialog = false;
    },
    AddOrUpdate() {
      if (
        this.obj.title == null ||
        this.obj.title == "" ||
        this.obj.managerName == null ||
        this.obj.managerName == "" ||
        this.obj.closingHour == null ||
        this.obj.openingHour == ""
      ) {
        this.$toast.add({
          severity: "error",
          summary: "Fields Required",
          life: 3000,
        });
        return 0;
      }
      service
        .PostCallService(
          this.obj.id == 0 ? "Branch/CreateBranch" : "Branch/UpdateBranch",
          this.obj
        )
        .then((res) => {
          this.$toast.add({
            severity: "success",
            summary: res.data.message,
            life: 3000,
          });
          this.LoadLazyData();
          if (this.obj.id != 0) {
            this.CancelEdit();
          } else {
            this.obj.id = 0;
            this.obj.closingHour = new Date(new Date().setHours(0, 30, 0, 0));
            this.obj.openingHour = new Date(new Date().setHours(0, 0, 0, 0));
            this.obj.title = null;
            this.obj.managerName = null;
          }
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