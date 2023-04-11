import * as THREE from "three";
import vertex from "../glsl/item.vert";
import fragment from "../glsl/item.frag";
import { MyObject3D } from "../webgl/myObject3D";
import { Update } from "../libs/update";
import { TexLoader } from "../webgl/texLoader";
import { Func } from "../core/func";
import { Param } from "../core/param";
import gsap from "gsap";

export class Images {
  // public items: Item[] = [];
  // private _images: { image: string; mask: string; selector: string }[] = [];
  constructor(container: THREE.Object3D) {
    const images = document.querySelectorAll(".image");
    images.forEach((image: any, index) => {
      const item = new Item(
        image.dataset.image,
        image.dataset.mask,
        `.image${index + 1}`
      );
      container.add(item);
      // this.items.push(item);
    });
  }
}

export class Item extends MyObject3D {
  private _width = 0;
  private _height = 0;
  private _material: THREE.ShaderMaterial;
  private _mesh: THREE.Mesh;
  private _selector: string;
  constructor(image: string, mask: string, selector: string) {
    super();

    this._selector = selector;
    const geometry = new THREE.PlaneGeometry(1, 1);
    this._material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        u_time: { value: Update.instance.elapsed },
        u_texture: { value: TexLoader.instance.get(image) },
        u_mask: { value: TexLoader.instance.get(mask) },
        u_resolution: {
          value: new THREE.Vector4(1, 1, 1, 1),
        },
        u_progress: {
          value: 0,
        },
        u_imageResolution: {
          value: new THREE.Vector2(1280, 530),
        },
      },
      transparent: true,
    });

    this._mesh = new THREE.Mesh(geometry, this._material);
    this.add(this._mesh);
    this._updateWidthHeight();
    this._resize();

    // setTimeout(() => {
    //   this._transition();
    // }, 500);

    // lenis.on("scroll", () => {
    // });
  }

  private _updateWidthHeight() {
    const dom = document.querySelector(this._selector)!;
    const { width, height, x, y } = dom.getBoundingClientRect();

    const posX = -Func.instance.sw() / 2 + width / 2 + x;
    const posY = Func.instance.sh() / 2 - height / 2 - y;
    this._width = width;
    this._height = height;
    this.position.set(posX, posY, 0.01);
    this._mesh.scale.set(width, height, 1);
  }

  private _updateResolution() {
    const { width, height, a1, a2 } = getResolution(
      this._width,
      this._height,
      530,
      1280
    );
    this._material.uniforms.u_resolution.value.set(width, height, a1, a2);
  }

  protected _update(): void {
    super._update();

    this._updateWidthHeight();
    this._updateResolution();
    this._material.uniforms.u_time.value = Update.instance.elapsed;
    this._material.uniforms.u_progress.value =
      Param.instance.main.progress.value;
  }

  protected _resize(): void {
    super._resize();
  }

  private _transition() {
    gsap.defaults({ overwrite: false });
    gsap.to(".image1", {
      x: -Func.instance.sw() * 0.2 - 16,
      duration: 1,
      ease: "slow",
    });
    gsap.to(".image1", {
      scale: 2.5,
      delay: 1.5,
      duration: 1,
    });
    gsap.to(Param.instance.main.progress, {
      value: 2.2,
      delay: 2,
      duration: 4,
    });
  }
}

function getResolution(
  elementWidth: number,
  elementHeight: number,
  imageHeight: number,
  imageWidth: number
) {
  const imageAspect = imageHeight / imageWidth;
  const width = elementWidth;
  const height = elementHeight;
  let a1, a2;
  if (height / width > imageAspect) {
    a1 = (width / height) * imageAspect;
    a2 = 1;
  } else {
    a1 = 1;
    a2 = height / width / imageAspect;
  }

  return { width, height, a1, a2 };
}
