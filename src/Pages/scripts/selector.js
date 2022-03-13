
function configurate_custom_selects(){
    let custom_selects, i, j, n_selects, n_options, selElmnt, selected, selected_text, selected_icon, custom_select_options, select_option;

    custom_selects = document.getElementsByClassName("custom-select");
    n_selects = custom_selects.length;
    
    for (i = 0; i < n_selects; i++) {
    selElmnt = custom_selects[i].getElementsByTagName("select")[0];
    n_options = selElmnt.length;
    /* For each element, create a new DIV that will act as the selected item: */

    selected = document.createElement("DIV");
    selected.setAttribute("class", "select-selected");

    selected_text = document.createElement("DIV");
    selected_text.setAttribute("class", "select-selected__text");
    selected_text.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    selected.appendChild(selected_text);

    selected_icon = document.createElement("span");
    selected_icon.setAttribute("class", "fas fa-chevron-down select-selected__icon")
    selected.appendChild(selected_icon);

    custom_selects[i].appendChild(selected)


    /* For each element, create a new DIV that will contain the option list: */
    custom_select_options = document.createElement("DIV");
    custom_select_options.setAttribute("class", "select-items select-hide");
    for (j = 0; j < n_options; j++) {
            /* For each option in the original select element,
            create a new DIV that will act as an option item: */
            select_option = document.createElement("DIV");
            select_option.innerHTML = selElmnt.options[j].innerHTML;
            select_option.addEventListener("click", function(e) {
                /* When an item is clicked, update the original select box,
                and the selected item: */
                let y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling.querySelector(".select-selected__text");
                for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                    y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
                }
                h.click();
                let event = new Event("change");
                s.dispatchEvent(event);
            });
            custom_select_options.appendChild(select_option);
        }
        custom_selects[i].appendChild(custom_select_options);
        selected.addEventListener("click", function(e) {
            /* When the select box is clicked, close any other select boxes,
            and open/close the current select box: */
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.querySelector(".select-selected__icon").classList.toggle("fa-chevron-down");
            this.querySelector(".select-selected__icon").classList.toggle("fa-chevron-up");
        });
    }
}


function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  let x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].querySelector(".select-selected__icon").classList.remove("fa-chevron-up");
      y[i].querySelector(".select-selected__icon").classList.add("fa-chevron-down");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
configurate_custom_selects();
document.addEventListener("click", closeAllSelect);